import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'String Escape',
    description: 'Escape text for most programming languages',
    id: 'string-escape',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        const stringified = JSON.stringify(`"${args.textContent}"`);

        return {
            text: stringified,
        };
    },
};
