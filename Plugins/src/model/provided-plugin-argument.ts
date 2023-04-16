import { PluginArgument } from './plugin-argument';
import { PluginResult } from './plugin-result';

export interface ProvidedPluginArgument extends PluginArgument {
    runPlugin(
        pluginId: string,
        args: string | PluginArgument,
        type?: 'system' | 'user' | 'default'
    ): Promise<PluginResult>;
}
