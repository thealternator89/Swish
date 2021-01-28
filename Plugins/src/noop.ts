import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'NO-OP',
    description:
        'A base plugin which does nothing (a NO-OP). Copy this to build a plugin.',
    id: 'noop',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        console.log('test');
        return args.textContent;
    },
};
