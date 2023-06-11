import { ProvidedPluginArgument } from './model';

export = {
    name: 'Format UUID',
    description: 'Format a UUID as 8-4-4-4-12',
    id: 'uuid-format',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'power_input',
    tags: ['uuid', 'format'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.replace(
            /([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})/,
            '$1-$2-$3-$4-$5'
        );
    },
};
