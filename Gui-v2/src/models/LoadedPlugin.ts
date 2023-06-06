import { PluginInputFormField } from "./FormFields";

export type LoadedPlugin = {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  icon: string;
  systemPlugin: boolean;
  input: {
    type: 'code' | 'form';
    syntax: string;
    fields: PluginInputFormField[];
    includeEditor?: boolean;
  };
};
