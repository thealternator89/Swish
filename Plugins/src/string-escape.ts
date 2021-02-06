import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'String Escape',
    description: 'Escape text for most programming languages',
    id: 'string-escape',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'code',
    process: async (args: ProvidedPluginArgument) => {
        return JSON.stringify(`"${args.textContent}"`);
    },
};
