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
                type: 'number',
                default: 1,
            },
            {
                key: 'shorten',
                label: 'Shorten',
                type: 'checkbox'
            },
            {
                key: 'format',
                label: 'Format',
                type: 'select',
                default: 'Text',
                opts: ['Text', 'JSON']
            }
        ],
    },
    process: async (args: ProvidedPluginArgument) => {
        let { count, shorten, format } = args.formContent;
        count = typeof count === 'number' && !Number.isNaN(count) ? count : 1;

        let uuids = new Array(count ?? 1).fill(0).map(() => v4());

        if (shorten) {
            uuids = uuids.map(uuid => uuid.replace(/-/g, ''));
        }

        switch (format) {
            case 'Text': return uuids.join('\n');
            case 'JSON': return {
                text: JSON.stringify(uuids, null, 4),
                syntax: 'json'
            }
            default: throw new Error(`Invalid format: ${format}`);
        }
    },
};
