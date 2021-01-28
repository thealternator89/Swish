import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'Reverse String',
    description: 'Reverses a string passed to it. e.g: "ABC123" -> "321CBA"',
    id: 'reverse-string',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        const input = args.textContent;
        let output = '';

        for (let i = input.length - 1; i >= 0; i--) {
            output += input[i];
        }

        return {
            text: output,
        };
    },
};
