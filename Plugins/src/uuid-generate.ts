import { ProvidedPluginArgument } from './model';
import { v4 } from 'uuid';

export = {
    name: 'Generate UUID',
    description:
        'A base plugin which does nothing (a NO-OP). Copy this to build a plugin.',
    id: 'uuid-generate',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    group: 'UUID',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return v4();
    },
};
