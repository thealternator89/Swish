import { ProvidedPluginArgument } from './model';

export = {
    name: 'NO-OP',
    description:
        'A base plugin which does nothing (a NO-OP). Copy this to build a plugin.',
    id: 'noop',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'hourglass_bottom',
    usableFrom: ['core', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent;
    },
};
