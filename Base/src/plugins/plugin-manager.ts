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

const BEEP_BASE_VERSION = require('../../package.json')
    .version.split('.')
    .map((n: string) => parseInt(n));

const SEARCH_KEYS = ['name', 'description', 'tags'];

const LocaleComparePluginDefinition = (a, b) => a.name.localeCompare(b.name);

class PluginManager {
    private readonly systemPlugins: PluginDefinition[] = [];
    private userPlugins: PluginDefinition[] = [];
    private userSelectablePlugins: PluginDefinition[];

    // Keeps track of which plugins are running, and with what data,
    // to ensure we don't enter an infinite loop and take down the entire app.
    private pluginStack: { id: string; data: string }[] = [];

    public constructor() {
        const systemPluginPath = path.join(
            __dirname,
            '..',
            '..',
            'node_modules',
            'swish-plugins',
            'dist'
        );
        this.systemPlugins = this.loadPluginSet(systemPluginPath);
        this.rebuildUserSelectablePlugins();
    }

    // TODO: Rename this. It's not an init anymore - "reloadUserPlugins" maybe?
    // Make userPluginPath required as well maybe.
    public init(userPluginPath?: string) {
        if (userPluginPath) {
            this.userPlugins = this.loadPluginSet(userPluginPath);
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
                file.endsWith('.js') && //find JS files
                !file.endsWith('.spec.js') && // which aren't specs
                !file.startsWith('_') // and don't start with '_'
        );

        const pluginObjs: PluginDefinition[] = [];

        for (const pluginFile of plugins) {
            const importedPlugins = require(`${resolvedDirectory}/${pluginFile}`) as
                | PluginDefinition
                | PluginDefinition[];

            let pluginItems : PluginDefinition[];

            if (Object.prototype.toString.call(importedPlugins) === '[object Object]') {
                pluginItems = [importedPlugins as PluginDefinition];
            } else {
                pluginItems = importedPlugins as PluginDefinition[];
            }

            for (let i = 0; i < pluginItems.length; i++) {
                const plugin = pluginItems[i] as PluginDefinition;

                if (
                    !this.checkPluginVersion(
                        plugin.swishVersion,
                        BEEP_BASE_VERSION
                    )
                ) {
                    continue;
                }

                // If plugin doesn't specify an id, use the filename as an id (excl. extension)
                // If multiple plugins in a module, add a suffix for all other than the first one.
                // e.g. `some-plugin`, `some-plugin-1`, `some-plugin-2`...
                if (!plugin.id) {
                    const baseId = pluginFile.substr(0, pluginFile.length - 3); // remove js extension
                    const idSuffix = i > 0 ? `-${i}` : '';
                    plugin.id = `${baseId}${idSuffix}`
                }
                pluginObjs.push(plugin);
            }
        }

        return pluginObjs;
    }

    private checkPluginVersion(
        pluginRequiredVersion: string,
        swishVersion: number[]
    ): boolean {
        // Plugin hasn't specified a version, ignore it.
        if (!pluginRequiredVersion) {
            return false;
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
    ): PluginDefinition {
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

    public searchPlugins(query: string): PluginDefinition[] {
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

    public getAllUserSelectablePlugins(appName?: 'clip'|'core'|'gui'): PluginDefinition[] {
        return this.userSelectablePlugins.filter(
            (plugin) =>
                !appName ||
                !plugin.usableFrom ||
                plugin.usableFrom.includes(appName)
        );
    }

    public getAllPluginsByGroup(): { [key: string]: PluginDefinition[] } {
        let groups = this.userSelectablePlugins
            .map((plugin) => plugin.group)
            .filter((group) => group)
            .sort((a, b) => a.localeCompare(b));

        groups = groups.filter(
            (group, index) => groups.indexOf(group) === index
        );

        const result = {};

        for (const group of groups) {
            result[group] = this.userSelectablePlugins
                .filter((plugin) => plugin.group === group)
                .sort(LocaleComparePluginDefinition);
        }

        result['_other'] = this.userSelectablePlugins.filter(
            (plugin) => !plugin.group
        );

        return result;
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
            throw new PluginNotFoundError(`Plugin with ID '${id}' not found!`);
        }

        const pluginDef = { id: id, data: args.textContent };

        if (
            this.pluginStack.find(
                (item) =>
                    item.id === pluginDef.id && item.data === pluginDef.data
            )
        ) {
            throw new InfiniteLoopError(
                `Infinite Loop detected: Called plugin '${id}' with the same data twice`
            );
        }

        this.pluginStack.push({ id: id, data: args.textContent });

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

function mergePluginLists(...lists: PluginDefinition[][]) {
    const output: PluginDefinition[] = [];

    for (const list of lists) {
        for (const plugin of list) {
            if (!output.find((existing) => existing.id === plugin.id)) {
                output.push(plugin);
            }
        }
    }

    return output;
}

function filterHiddenPlugins(list: PluginDefinition[]) {
    return list.filter((plugin) => !plugin.hidden);
}

function resolvePath(origPath: string) {
    if (!origPath.startsWith('~')) {
        return origPath;
    }

    return path.join(homedir(), origPath.substr(1));
}

export const pluginManager = new PluginManager();
