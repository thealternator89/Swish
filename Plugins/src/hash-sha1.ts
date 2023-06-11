import { SHA1 } from 'crypto-js';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'SHA1',
    description: 'Compute the SHA1 hash of your text',
    id: 'hash-sha1',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'fingerprint',
    tags: ['SHA1', 'crypto', 'hash'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return SHA1(args.textContent).toString();
    },
};
