import { PluginDefinition } from '../../shared/models/plugin-definition';
declare class PluginListManager {
    private selectedPlugin;
    private plugins;
    private listRootElement;
    constructor();
    setPluginList(plugins: PluginDefinition[]): void;
    renderPluginList(): void;
    nextPlugin(): void;
    prevPlugin(): void;
    getSelectedPlugin(): PluginDefinition;
    private selectPlugin;
    private destroyPluginList;
    private buildPluginItemElement;
}
export declare const pluginListManager: PluginListManager;
export {};
