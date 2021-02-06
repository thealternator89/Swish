import { readdirSync } from 'fs';
import * as path from 'path';
import { PluginDefinition } from './plugin-definition';
import Fuse from 'fuse.js';
import {
    ProvidedPluginArgument,
    PluginArgument,
    PluginResult,
} from 'beep-plugins/dist/lib/plugin-definition';
import { InfiniteLoopError, PluginNotFoundError } from '../errors';

const BEEP_BASE_VERSION = require('../../package.json')
    .version.split('.')
    .map((n: string) => parseInt(n));

class PluginManager {
    private readonly systemPlugins: PluginDefinition[] = [];
    private userPlugins: PluginDefinition[] = [];

    // Keeps track of which plugins are running, to ensure we don't enter an infinite loop and take down the entire app.
    private pluginStack: string[] = [];

    public constructor() {
        const systemPluginPath = path.join(
            __dirname,
            '..',
            '..',
            'node_modules',
            'beep-plugins',
            'dist'
        );
        this.systemPlugins = this.loadPluginSet(systemPluginPath);
    }

    // TODO: Rename this. It's not an init anymore - "reloadUserPlugins" maybe?
    // Make userPluginPath required as well maybe.
    public init(userPluginPath?: string) {
        if (userPluginPath) {
            this.userPlugins = this.loadPluginSet(userPluginPath);
        }
    }

    private loadPluginSet(directory: string): PluginDefinition[] {
        const plugins = readdirSync(directory).filter((file) =>
            file.endsWith('.js')
        ); // we only want JS files

        const pluginObjs: PluginDefinition[] = [];

        for (const pluginFile of plugins) {
            const plugin = require(`${directory}/${pluginFile}`) as PluginDefinition;

            if (
                !this.checkPluginVersion(plugin.beepVersion, BEEP_BASE_VERSION)
            ) {
                continue;
            }

            // If plugin doesn't specify an id, use the filename as an id (excl. extension)
            if (!plugin.id) {
                plugin.id = pluginFile.substr(0, pluginFile.length - 3); // remove js extension
            }
            pluginObjs.push(plugin);
        }

        return pluginObjs;
    }

    private checkPluginVersion(
        pluginRequiredVersion: string,
        beepVersion: number[]
    ): boolean {
        const requiredBeepVersion = pluginRequiredVersion
            .split('.')
            .map((n) => parseInt(n));
        return (
            requiredBeepVersion[0] === beepVersion[0] && // Major version matches AND
            requiredBeepVersion[1] <= beepVersion[1]
        ); // Minor version is less than or equal
    }

    public getSystemPlugins() {
        return this.systemPlugins;
    }

    public getUserPlugins() {
        return this.userPlugins;
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
        const fuse = new Fuse(
            mergePluginLists(this.userPlugins, this.systemPlugins),
            { keys: ['name', 'description', 'tags'] }
        );
        const results = fuse.search(query);
        return results.map((result) => result.item);
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
    ): Promise<string | PluginResult> {
        const plugin = this.getPluginById(id, type);

        if (!plugin) {
            throw new PluginNotFoundError(`Plugin with ID ${id} not found!`);
        }

        this.pluginStack.push(id);

        if (
            this.pluginStack.filter((pluginId) => pluginId === id).length >= 100
        ) {
            this.pluginStack.pop();
            throw new InfiniteLoopError(
                `Infinite Loop: Plugin ${id} has been called too many times!`
            );
        }

        try {
            return await plugin.process({
                progressUpdate: () => undefined,
                statusUpdate: () => undefined,
                ...args,
                runPlugin: (id, args, type) =>
                    this.internalRunPlugin(id, args, type),
            });
        } catch (error) {
            throw error;
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

export const pluginManager = new PluginManager();
