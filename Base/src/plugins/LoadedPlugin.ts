import { PluginDefinition } from 'swish-plugins/dist/model';

export interface LoadedPlugin extends PluginDefinition {
    systemPlugin: boolean;
}
