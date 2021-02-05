import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'Reverse String',
    description: 'Reverses a string passed to it. e.g: "ABC123" -> "321CBA"',
    id: 'reverse-string',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        return args.textContent.split('').reverse().join('');
    },
};
