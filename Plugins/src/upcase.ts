import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'Upcase',
    description: 'Convert input to uppercase',
    id: 'upcase',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    tags: ['text', 'format', 'uppercase'],
    process: async (args: PluginArgument) => {
        return {
            text: args.textContent.toUpperCase(),
        };
    },
};
