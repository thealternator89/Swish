import { existsSync, readdirSync } from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import Fuse from 'fuse.js';
import {
    PluginDefinition,
    ProvidedPluginArgument,
    PluginArgument,
    PluginResult,
} from 'swish-plugins/dist/model';
import { InfiniteLoopError, PluginNotFoundError } from '../errors';
import { identifyLineEndingChar, unifyLineEndings } from '../util/text-utils';
import { backgroundManager } from '../util/background-manager';
import { configManager } from '../config/config-manager';
import { loadCjsPlugin } from './plugin-loader';
import { LoadedPlugin } from './LoadedPlugin';
import { Logger } from '../util/log-manager';

const BEEP_BASE_VERSION = require('../../package.json')
    .version.split('.')
    .map((n: string) => parseInt(n));

const SEARCH_KEYS = ['name', 'tags'];

const LocaleComparePluginDefinition = (a, b) => a.name.localeCompare(b.name);

const logger = new Logger('plugin-manager');

class PluginManager {
    private readonly systemPlugins: LoadedPlugin[] = [];
    private userPlugins: LoadedPlugin[] = [];
    private userSelectablePlugins: LoadedPlugin[];

    // Keeps track of which plugins are running, and with what data,
    // to ensure we don't enter an infinite loop and take down the entire app.
    private pluginStack: {
        id: string;
        data: string;
        system: boolean;
    }[] = [];

    public constructor() {
        // Monkey patch setTimeout and setInterval to allow us to track them and clear them when the plugin finishes
        backgroundManager.initialize();
        const systemPluginPath = path.join(
            __dirname,
            '..',
            '..',
            'node_modules',
            'swish-plugins',
            'dist'
        );
        this.systemPlugins = this.loadPluginSet(systemPluginPath).map(
            (plugin) => ({
                ...plugin,
                systemPlugin: true, // store that this is a system plugin
            })
        );
        this.rebuildUserSelectablePlugins();
    }

    public reloadUserPlugins() {
        const userPluginPath = (configManager.config as any).userPlugins;

        if (userPluginPath) {
            this.userPlugins = this.loadPluginSet(userPluginPath).map(
                (plugin) => ({
                    ...plugin,
                    systemPlugin: false, // store that this is not a system plugin
                })
            );
        } else {
            this.userPlugins = [];
        }

        this.rebuildUserSelectablePlugins();
    }

    private loadPluginSet(directory: string): PluginDefinition[] {
        const resolvedDirectory = resolvePath(directory);

        if (!existsSync(resolvedDirectory)) {
            return [];
        }

        const plugins = readdirSync(resolvedDirectory).filter(
            (file) =>
                (file.endsWith('.js') || file.endsWith('.json')) && //find JS or JSON files
                !file.endsWith('.spec.js') && // which aren't specs
                !file.startsWith('_') && // and don't start with '_'
                !/package(-lock)?\.json/.test(file) // not package.json or package-lock.json
        );

        let pluginObjs: PluginDefinition[] = [];

        plugins.forEach((plugin) => {
            const module = loadCjsPlugin(
                plugin,
                resolvedDirectory,
                (loadedPlugin) =>
                    this.checkPluginVersion(
                        loadedPlugin,
                        BEEP_BASE_VERSION
                    )
            );
            pluginObjs = pluginObjs.concat(module);
        });

        return pluginObjs;
    }

    private checkPluginVersion(
        plugin: PluginDefinition,
        swishVersion: number[]
    ): boolean {
        // Plugin hasn't specified a version, assume it works.
        if (!plugin.swishVersion) {
            return true;
        }

        const requiredVersion = plugin.swishVersion
            .split('.')
            .map((n) => parseInt(n));

        const versionMatches = (
            requiredVersion[0] === swishVersion[0] && // Major version matches AND
            requiredVersion[1] <= swishVersion[1]
        ); // Minor version is less than or equal

        if (!versionMatches) {
            logger.writeWarning(`Plugin "${plugin.name}" (id: ${plugin.id}) requires Swish version ${plugin.swishVersion} but we're running ${swishVersion.join('.')}. Skipping.`);
        }

        return versionMatches;
    }

    public getSystemPlugins() {
        return filterHiddenPlugins(this.systemPlugins);
    }

    public getUserPlugins() {
        return filterHiddenPlugins(this.userPlugins);
    }

    public getPluginById(
        id: string,
        type: 'system' | 'user' | 'default' = 'default'
    ): LoadedPlugin {
        const findPluginFunc = (plugin) => plugin.id === id;

        switch (type) {
            case 'default':
                return (
                    this.userPlugins.find(findPluginFunc) ||
                    this.systemPlugins.find(findPluginFunc)
                );
            case 'system':
                return this.systemPlugins.find(findPluginFunc);
            case 'user':
                return this.userPlugins.find(findPluginFunc);
        }
    }

    public searchPlugins(query: string, tags?: string[]): LoadedPlugin[] {
        const pluginsToSearch = this.getPluginsForSearch(tags);

        if (!query) {
            return pluginsToSearch.sort(
                LocaleComparePluginDefinition
            );
        }

        const fuse = new Fuse(pluginsToSearch, {
            keys: SEARCH_KEYS,
        });

        const results = fuse.search(query);
        return results.map((result) => result.item);
    }

    // If no tags are passed, return all plugins, otherwise return only plugins which have all the tags.
    private getPluginsForSearch(tags?: string[]) {
        if (!tags || !tags.length) {
            return this.userSelectablePlugins;
        }

        return this.userSelectablePlugins.filter((plugin) =>
            tags.every((tag) => plugin.tags.some((pluginTag) => pluginTag.toLocaleLowerCase() === tag.toLocaleLowerCase()))
        );
    }

    /**
     * Get all user-selectable plugins for a specific Swish application
     * @param appName app name - to restrict the items to ones which say they are capable of working in that app
     * @returns An array of all plugins which the user can select
     */
    public getAllUserSelectablePlugins(
        appName?: 'clip' | 'core' | 'gui'
    ): LoadedPlugin[] {
        return this.userSelectablePlugins.filter(
            (plugin) =>
                !appName || // If we haven't passed an app name, just include all plugins
                !plugin.usableFrom || // If the plugin doesn't restrict where it can be used, include it
                plugin.usableFrom.includes(appName) // Check if the requested app is able to use plugin
        );
    }

    /**
     * Run a plugin and get the result
     * @param id The ID of the plugin to run
     * @param args Arguments for running the plugin
     * @param type Type of plugin, system/user/default. Defaults to 'default' where a user plugin is used if found, falling back to system plugins.
     * @param topLevel Whether this is the top level plugin or not (to handle calling other plugins). Defaults to true.
     */
    public async runPlugin(
        id: string,
        args: PluginArgument,
        type?: 'system' | 'user' | 'default',
        topLevel: boolean = true
    ): Promise<PluginResult> {
        const plugin = this.getPluginById(id, type);

        if (!plugin) {
            // If type is 'user' or 'system' this becomes 'user plugin'/'system plugin'
            // Otherwise it is just 'plugin'
            let pluginType = type + ' plugin';
            if (type === 'default' || !type) {
                pluginType = 'plugin';
            }

            throw new PluginNotFoundError(
                `Failed to find ${pluginType} with ID '${id}'!`
            );
        }

        const pluginDef = {
            id: id,
            data: args.textContent,
            system: plugin.systemPlugin,
        };

        if (
            this.pluginStack.find(
                (item) =>
                    item.id === pluginDef.id &&
                    item.data === pluginDef.data &&
                    item.system === plugin.systemPlugin
            )
        ) {
            throw new InfiniteLoopError(
                `Infinite Loop detected: Called plugin '${id}' with the same data twice`
            );
        }

        this.pluginStack.push({
            id: id,
            data: args.textContent,
            system: plugin.systemPlugin,
        });

        try {
            const lineEndingChar = identifyLineEndingChar(args.textContent);
            const unifiedTextContent = unifyLineEndings(args.textContent);

            // Set up a global environment for the plugin to use to access the plugin API
            // TODO - it would be good if we can handle swapping these over and back for child plugins - low priority since it's not likely to be _that_ useful.
            // e.g. Plugin A launches and calls runPlugin for Plugin B, passing its own "progressUpdate" function
            //  while Plugin B is running the passed progressUpdate function is used, but when it returns to Plugin A it reverts to the original.
            if (topLevel) {
                (global as any).progressUpdate = args.progressUpdate ?? (() => undefined);
                (global as any).statusUpdate = args.statusUpdate ?? (() => undefined);
                (global as any).runPlugin = (id, args, type) => this.internalRunPlugin(id, args, type);
            }

            const runResult = await plugin.process({
                progressUpdate: (global as any).progressUpdate,
                statusUpdate: (global as any).statusUpdate,
                ...args,
                runPlugin: (global as any).runPlugin,
                textContent: unifiedTextContent,
            });

            // Clean up the global environment
            if (topLevel){
                (global as any).progressUpdate = undefined;
                (global as any).statusUpdate = undefined;
                (global as any).runPlugin = undefined;
            }

            if (typeof runResult === 'string') {
                return {
                    text: unifyLineEndings(runResult, lineEndingChar),
                };
            } else {
                return {
                    ...runResult,
                    text: runResult.text
                        ? unifyLineEndings(runResult.text, lineEndingChar)
                        : undefined,
                    html: runResult.html
                        ? unifyLineEndings(runResult.html, lineEndingChar)
                        : undefined,
                    rtf: runResult.rtf
                        ? unifyLineEndings(runResult.rtf, lineEndingChar)
                        : undefined,
                };
            }
        } catch (error) {
            // If we are not running a top level plugin, we should throw the error so it is passed up the chain
            // Otherwise we should wrap it in a PluginErrorResult to simplify how the client handles it
            if (!topLevel) {
                throw error;
            }

            return {
                message: {
                    level: 'error',
                    text: error.message,
                },
            };
        } finally {
            this.pluginStack.pop();

            // If the stack is empty, we are at the end of the plugin chain, so we should ensure that any background tasks from the plugin are killed
            if (this.pluginStack.length === 0) {
                backgroundManager.killActiveBackgroundTasks(plugin.id);
            }
        }
    }

    /**
     * The RunPlugin function passed to plugins. This stubs out unneeded features which the base apps use.
     * This also unwraps the result of the plugin to always resolve to a string.
     * @param id The ID of the plugin to run
     * @param args Plugin arguments for running the plugin, or the text to pass to the plugin
     * @param type Type of plugin, system/user/default. Defaults to 'system'. 'default' refers to default behaviour which is to use a user plugin if available, falling back to the system one.
     */
    private async internalRunPlugin(
        id: string,
        args: string | PluginArgument,
        type: 'system' | 'user' | 'default' = 'system'
    ): Promise<PluginResult> {
        let anyArgs;

        if (typeof args === 'string') {
            anyArgs = {
                textContent: args,
            };
        } else {
            anyArgs = args;
        }

        const unifiedArgs: ProvidedPluginArgument = {
            progressUpdate: () => undefined,
            statusUpdate: () => undefined,
            ...anyArgs,
            runPlugin: (id, args, type) =>
                this.internalRunPlugin(id, args, type),
        };

        const result = await this.runPlugin(id, unifiedArgs, type, false);

        if (typeof result === 'string') {
            return {text: result};
        }

        if (!result) {
            return {};
        }

        return result;
    }

    private rebuildUserSelectablePlugins(): void {
        this.userSelectablePlugins = filterHiddenPlugins(
            mergePluginLists(this.userPlugins, this.systemPlugins)
        );
    }

    private getPluginsForTag(tag: string): LoadedPlugin[] {
        return this.userSelectablePlugins.filter((plugin) =>
            plugin.tags.includes(tag)
        );
    }
}

function mergePluginLists(...lists: LoadedPlugin[][]) {
    const output: LoadedPlugin[] = [];

    for (const list of lists) {
        for (const plugin of list) {
            if (!output.find((existing) => existing.id === plugin.id)) {
                output.push(plugin);
            }
        }
    }

    return output;
}

function filterHiddenPlugins(list: LoadedPlugin[]) {
    return list.filter((plugin) => !plugin.hidden);
}

function resolvePath(origPath: string) {
    if (!origPath.startsWith('~')) {
        return origPath;
    }

    return path.join(homedir(), origPath.substring(1));
}

export const pluginManager = new PluginManager();
