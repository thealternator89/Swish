import { ProvidedPluginArgument } from './model';
import { v1, v4 } from 'uuid';

export = {
    name: 'Generate UUID',
    description: 'Generate one or more UUIDs',
    id: 'uuid-generate',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'loop',
    tags: ['uuid', 'guid', 'uniqueidentifier', 'generate'],
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
                key: 'version',
                label: 'Version',
                type: 'select',
                default: 'v4',
                opts: ['nil', 'omni', 'v1', 'v4'],
            },
            {
                key: 'shorten',
                label: 'Shorten',
                type: 'checkbox',
            },
            {
                key: 'format',
                label: 'Format',
                type: 'select',
                default: 'Text',
                opts: ['Text', 'JSON'],
            },
        ],
    },
    process: async (args: ProvidedPluginArgument) => {
        let { count, version, shorten, format } = args.formContent;
        count = typeof count === 'number' && !Number.isNaN(count) ? count : 1;

        const genFunction = getUuidFunction(version ?? 'v4');

        let uuids = new Array(count ?? 1).fill(0).map(() => genFunction());

        if (shorten) {
            uuids = uuids.map((uuid) => uuid.replace(/-/g, ''));
        }

        if (format === 'JSON') {
            return {
                text: JSON.stringify(uuids, null, 4),
                syntax: 'json',
            };
        }

        return uuids.join('\n');
    },
};

function getUuidFunction(version: string): () => string {
    switch (version) {
        case 'nil':
            return () => '00000000-0000-0000-0000-000000000000';
        case 'omni':
            return () => 'ffffffff-ffff-ffff-ffff-ffffffffffff';
        case 'v1':
            return v1;
        case 'v4':
            return v4;
        default:
            throw new Error(`Invalid UUID version: ${version}`);
    }
}
