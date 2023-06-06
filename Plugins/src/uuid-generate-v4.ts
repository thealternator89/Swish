import { ProvidedPluginArgument } from './model';
import { v4 } from 'uuid';

export = {
    name: 'Generate UUID',
    description: 'Generate a V4 UUID',
    id: 'uuid-generate-v4',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'loop',
    tags: ['uuid', 'random', 'generate'],
    usableFrom: ['core', 'clip', 'gui'],
    input: {
        type: 'form',
        fields: [
            {
                key: 'count',
                label: 'Number of UUIDs',
                type: 'number'
            }
        ],
    },
    process: async (args: ProvidedPluginArgument) => {
        const count = args.formContent?.count ?? 1;
        const uuids = new Array(count).fill(0).map(() => v4());

        return uuids.join('\n');
    },
};
