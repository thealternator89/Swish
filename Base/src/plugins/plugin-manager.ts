import { readdirSync } from 'fs';
import * as path from 'path';
import { PluginDefinition } from './plugin-definition';
import Fuse from 'fuse.js'

const BEEP_BASE_VERSION = require('../../package.json')
    .version.split('.')
    .map((n: string) => parseInt(n));

class PluginManager {
    private readonly systemPlugins: PluginDefinition[] = [];
    private userPlugins: PluginDefinition[] = [];

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

    public getPluginById(id: string): PluginDefinition {
        const findPluginFunc = (plugin) => plugin.id === id;

        // If a matching user plugin is found, return it. Otherwise return a matching system plugin.
        return (
            this.userPlugins.find(findPluginFunc) ||
            this.systemPlugins.find(findPluginFunc)
        );
    }

    public searchPlugins(query: string): PluginDefinition[] {
        const fuse = new Fuse(mergePluginLists(this.userPlugins, this.systemPlugins), {keys: ['name', 'description', 'tags']});
        const results = fuse.search(query);
        return results.map((result) => result.item);
    }
}

function mergePluginLists(...lists: PluginDefinition[][]) {
    const output: PluginDefinition[] = []

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
