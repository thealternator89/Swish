import { SHA512 } from 'crypto-js';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'SHA512',
    description: 'Compute the SHA512 hash of your text',
    id: 'hash-sha512',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'fingerprint',
    process: async (args: ProvidedPluginArgument) => {
        return SHA512(args.textContent).toString();
    },
};
