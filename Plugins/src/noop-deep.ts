import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'NO-OP - Deep',
    description:
        'A base plugin which does nothing (a NO-OP), slowly. Use this to build a plugin.',
    id: 'noop-deep',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: (args: ProvidedPluginArgument) => {
        return args.runPlugin('noop-slow', {
            ...args,
            statusUpdate: (text) => args.statusUpdate('NO-OP - Slow: ' + text),
        });
    },
};
