import { ProvidedPluginArgument } from './model';
import { v4 } from 'uuid';

export = {
    name: 'Generate UUID',
    description: 'Generate a V4 UUID',
    id: 'uuid-generate-v4',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    group: 'UUID',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (_args: ProvidedPluginArgument) => {
        return v4();
    },
};
