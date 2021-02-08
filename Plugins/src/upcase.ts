import { ProvidedPluginArgument } from './model';

export = {
    name: 'Upcase',
    description: 'Convert input to uppercase',
    id: 'upcase',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'arrow_upward',
    tags: ['text', 'format', 'uppercase'],
    process: async (args: ProvidedPluginArgument) => {
        return {
            text: args.textContent.toUpperCase(),
        };
    },
};
