import { PluginDefinition, PluginResult } from 'swish-base';
declare class SwishBackend {
    constructor();
    getConfig(): any;
    search(query: string): PluginDefinition[];
    reloadUserPlugins(): void;
    getPluginName(pluginId: string): string;
    runPlugin(pluginId: string, data: string): Promise<PluginResult>;
}
export declare const swishBackend: SwishBackend;
export {};
