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
    includeEditor?: boolean; // Whether to include the editor in the form
    editorPosition?: 'top' | 'bottom'; // Only used if includeEditor is true - default is bottom
}

export interface PluginInputFormField {
    key: string; // The key to use when accessing the value of this field - must be unique.
    type: 'text' | 'number' | 'checkbox' | 'select' | 'date'; // The type of input to display
    label: string; // The label for this field
    heading?: boolean; // Only used for labels - indicates that this label is a heading
    opts?: string[]; // Only used if type is select - the options to choose from
    default?: string | number | boolean; // The default value for this field
  }
  
