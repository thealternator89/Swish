import { type } from 'os';
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
    input?: PluginInput
}

export interface PluginInput {
    type?: 'text' | 'form'; // Default is text
    syntax?: string; // Only used if type is text - default is plain text
    fields?: PluginInputFormField[]; // Only used if type is form
}

export interface PluginInputFormField {
    key: string;
    type: 'text' | 'number' | 'checkbox' | 'select' | 'radio' | 'code' | 'date';
    label: string;
  }
  
