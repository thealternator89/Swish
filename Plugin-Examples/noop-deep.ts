export = {
    name: 'NO-OP - Deep',
    description:
        'A base plugin which does nothing (a NO-OP), slowly, using the noop-slow plugin. Use this to build a plugin.',
    id: 'noop-deep',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'layers',
    usableFrom: ['core', 'gui'],
    process: (args: any) => {
        // This tells Swish to run the noop-slow plugin
        return args.runPlugin('noop-slow', {
            ...args,
            statusUpdate: (text) => args.statusUpdate('NO-OP - Slow: ' + text),
        });
    },
};
