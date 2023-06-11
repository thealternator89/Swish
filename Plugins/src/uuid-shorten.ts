import { ProvidedPluginArgument } from './model';

export = {
    name: 'Shorten UUID',
    description: 'Remove hyphens from UUID',
    id: 'uuid-shorten',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'content_cut',
    tags: ['uuid', 'shorten'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.replace(
            /([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})/,
            '$1$2$3$4$5'
        );
    },
};
