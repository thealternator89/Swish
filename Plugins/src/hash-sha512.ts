import { SHA512 } from 'crypto-js';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'SHA512',
    description: 'Compute the SHA512 hash of your text',
    id: 'hash-sha512',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'fingerprint',
    tags: ['SHA512', 'crypto', 'hash'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return SHA512(args.textContent).toString();
    },
};
