import { SHA256 } from 'crypto-js';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'SHA256',
    description: 'Compute the SHA256 hash of your text',
    id: 'hash-sha256',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'fingerprint',
    tags: ['SHA256', 'crypto', 'hash'],
    group: 'Cryptography',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return SHA256(args.textContent).toString();
    },
};
