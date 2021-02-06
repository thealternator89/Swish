import { PluginResult } from './plugin-result';
import { ProvidedPluginArgument } from './provided-plugin-argument';

export interface PluginDefinition {
    name: string;
    id?: string;
    description: string;
    author: string;
    tags: string[];
    beepVersion: string;
    icon: string;
    hidden?: boolean;
    process: (args: ProvidedPluginArgument) => Promise<string | PluginResult>;
}
