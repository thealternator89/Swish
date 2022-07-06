import { ProvidedPluginArgument } from './model';

export = {
    name: 'Base-64 Decode',
    description: 'Decode a Base-64 encoded string',
    id: 'base64-decode',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'text'],
    swishVersion: '1.0.0',
    icon: 'code',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        let binaryData = Buffer.from(args.textContent, 'base64');
        return binaryData.toString('utf8');
    },
};
