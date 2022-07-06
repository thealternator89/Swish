import { ProvidedPluginArgument } from './model';

export = {
    name: 'Base-64 Encode',
    description: 'Encode text as a Base-64 encoded string',
    id: 'base64-encode',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    tags: ['base64', 'encode', 'text'],
    icon: 'code',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        let binaryData = Buffer.from(args.textContent, 'utf8');
        return binaryData.toString('base64');
    },
};
