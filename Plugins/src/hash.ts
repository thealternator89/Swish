import * as crypto from 'crypto-js';
import { PluginResult, ProvidedPluginArgument } from './model';

export = {
    name: 'Hash',
    description:
        'Compute the hash of a string using MD5, SHA1, SHA256 or SHA512',
    id: 'hash',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'fingerprint',
    tags: ['crypto', 'hash', 'MD5', 'SHA1', 'SHA256', 'SHA512'],
    input: {
        type: 'form',
        fields: [
            {
                key: 'algorithm',
                label: 'Algorithm',
                type: 'select',
                opts: ['*All', 'MD5', 'SHA1', 'SHA256', 'SHA512'],
                default: '*All',
            },
        ],
        includeEditor: true,
        editorPosition: 'top',
    },
    process: async (args: ProvidedPluginArgument) => {
        const { algorithm } = args.formContent ?? { algorithm: '*All' };
        const text = args.textContent;

        switch (algorithm) {
            case 'MD5':
            case 'SHA1':
            case 'SHA256':
            case 'SHA512':
                return hash(text, algorithm);
            default:
                return hashAll(text, ['MD5', 'SHA1', 'SHA256', 'SHA512']);
        }
    },
};

function hash(value: string, algorithm: string): PluginResult {
    const algorithmFn = crypto[algorithm];
    const hashed = algorithmFn(value).toString();

    return {
        text: hashed,
        render: 'text',
        data: {
            [algorithm]: hashed
        }
    };
}

function hashAll(value: string, algorithms: string[]): PluginResult {
    const results: Record<string, string> = {};

    for (const algorithm of algorithms) {
        results[algorithm] = hash(value, algorithm).text;
    }

    return {
        text: Object.keys(results)
            .map((key) => `${key}:\n${results[key]}`)
            .join('\n\n'),
        markdown: Object.keys(results)
            .map((key) => `**${key}**:\n\n>\`${results[key]}\``)
            .join('\n\n---\n\n'),
        render: 'markdown',
        data: {
            ...results
        }
    };
}
