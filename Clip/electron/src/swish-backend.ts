import {
    PluginDefinition,
    PluginResult,
    pluginManager,
    configManager,
} from 'swish-base';

class SwishBackend {
    constructor() {
        this.reloadUserPlugins();
    }

    public getConfig(): any {
        return configManager?.config;
    }

    public search(query: string): PluginDefinition[] {
        return pluginManager.searchPlugins(query);
    }

    public reloadUserPlugins() {
        pluginManager.reloadUserPlugins();
    }

    public getPluginName(pluginId: string): string {
        return pluginManager.getPluginById(pluginId)?.name;
    }

    public async runPlugin(
        pluginId: string,
        data: string
    ): Promise<PluginResult> {
        return pluginManager.runPlugin(pluginId, {
            textContent: data,
            progressUpdate: (percent: number) => undefined, //TODO surface these somewhere
            statusUpdate: (status: string) => undefined,
        });
    }
}

export const swishBackend = new SwishBackend();
