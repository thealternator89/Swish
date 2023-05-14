import { PluginResult } from './plugin-result';
import { ProvidedPluginArgument } from './provided-plugin-argument';

type SwishApplication = 'clip' | 'core' | 'gui';

export interface PluginDefinition {
    name: string;
    id?: string;
    description?: string;
    author?: string;
    tags?: string[];
    swishVersion?: string;
    icon?: string;
    hidden?: boolean;
    usableFrom?: SwishApplication[];
    type?: 'standard' | 'aggregate';
    process?: (args: ProvidedPluginArgument) => Promise<string | PluginResult>;
    plugins?: string[];
    input?: {syntax?: string}
}
