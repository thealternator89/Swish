import { ProvidedPluginArgument } from './model';

export = {
    name: 'Decode URI Component',
    description: `Decode a URI component to display the human-readable version`,
    id: 'decode-uri-component',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'emoji_symbols',
    tags: ['decode', 'web', 'URI', 'URL'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return decodeURIComponent(args.textContent);
    },
};
