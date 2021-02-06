import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Base-64 Decode',
    description: 'Decode a Base-64 encoded string',
    id: 'base64-decode',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'text'],
    beepVersion: '1.0.0',
    icon: 'code',
    process: async (args: ProvidedPluginArgument) => {
        let binaryData = Buffer.from(args.textContent, 'base64');
        return binaryData.toString('utf8');
    },
};
