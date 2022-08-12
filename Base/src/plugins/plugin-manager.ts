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
import { configManager } from '../config/config-manager';
import { loadCjsPlugin } from './plugin-loader';
import { LoadedPlugin } from './LoadedPlugin';

const BEEP_BASE_VERSION = require('../../package.json')
    .version.split('.')
    .map((n: string) => parseInt(n));

const SEARCH_KEYS = ['name', 'tags'];

const LocaleComparePluginDefinition = (a, b) => a.name.localeCompare(b.name);

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
                        loadedPlugin.swishVersion,
                        BEEP_BASE_VERSION
                    )
            );
            pluginObjs = pluginObjs.concat(module);
        });

        return pluginObjs;
    }

    private checkPluginVersion(
        pluginRequiredVersion: string,
        swishVersion: number[]
    ): boolean {
        // Plugin hasn't specified a version, assume it works.
        if (!pluginRequiredVersion) {
            return true;
        }

        const requiredVersion = pluginRequiredVersion
            .split('.')
            .map((n) => parseInt(n));
        return (
            requiredVersion[0] === swishVersion[0] && // Major version matches AND
            requiredVersion[1] <= swishVersion[1]
        ); // Minor version is less than or equal
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

    public searchPlugins(query: string): LoadedPlugin[] {
        if (!query) {
            return this.userSelectablePlugins.sort(
                LocaleComparePluginDefinition
            );
        }

        const fuse = new Fuse(this.userSelectablePlugins, {
            keys: SEARCH_KEYS,
        });

        const results = fuse.search(query);
        return results.map((result) => result.item);
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
     */
    public async runPlugin(
        id: string,
        args: PluginArgument,
        type?: 'system' | 'user' | 'default'
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

            const runResult = await plugin.process({
                progressUpdate: () => undefined,
                statusUpdate: () => undefined,
                ...args,
                runPlugin: (id, args, type) =>
                    this.internalRunPlugin(id, args, type),
                textContent: unifiedTextContent,
            });

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
            return {
                message: {
                    level: 'error',
                    text: error.message,
                },
            };
        } finally {
            this.pluginStack.pop();
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
    ): Promise<string> {
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

        const result = await this.runPlugin(id, unifiedArgs, type);

        if (typeof result === 'string') {
            return result;
        }

        if (!result) {
            return '';
        }

        return result.text;
    }

    private rebuildUserSelectablePlugins(): void {
        this.userSelectablePlugins = filterHiddenPlugins(
            mergePluginLists(this.userPlugins, this.systemPlugins)
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
