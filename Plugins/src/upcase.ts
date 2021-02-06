import { ProvidedPluginArgument } from './model';

export = {
    name: 'Upcase',
    description: 'Convert input to uppercase',
    id: 'upcase',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'keyboard_arrow_up',
    tags: ['text', 'format', 'uppercase'],
    process: async (args: ProvidedPluginArgument) => {
        return {
            text: args.textContent.toUpperCase(),
        };
    },
};
