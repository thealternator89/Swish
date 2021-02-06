import { PluginArgument } from './plugin-argument';

export interface ProvidedPluginArgument extends PluginArgument {
    runPlugin(
        pluginId: string,
        args: string | PluginArgument,
        type?: 'system' | 'user' | 'default'
    ): Promise<string>;
}
