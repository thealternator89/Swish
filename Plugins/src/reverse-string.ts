import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Reverse String',
    description: 'Reverses a string passed to it. e.g: "ABC123" -> "321CBA"',
    id: 'reverse-string',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'sort',
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.split('').reverse().join('');
    },
};
