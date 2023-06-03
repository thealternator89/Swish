import { ProvidedPluginArgument } from './model';

export = {
    name: 'Encode URI Component',
    description: `Encodes text for use in a URI`,
    id: 'encode-uri-component',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'emoji_symbols',
    tags: ['encode', 'web', 'url'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return encodeURIComponent(args.textContent);
    },
};
