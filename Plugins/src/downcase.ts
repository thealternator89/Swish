import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Downcase',
    description: 'Convert input to lowercase',
    id: 'downcase',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.toLowerCase();
    },
};
