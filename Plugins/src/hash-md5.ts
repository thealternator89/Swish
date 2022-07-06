import { MD5 } from 'crypto-js';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'MD5 Checksum',
    description: 'Compute the MD5 checksum of your text',
    id: 'hash-md5',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'fingerprint',
    tags: ['MD5', 'crypto', 'hash'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return MD5(args.textContent).toString();
    },
};
