// Example 3: NO-OP - Deep
//
// This plugin offloads its job to another plugin - [NO-OP - Slow]
// You don't need to write everything to get a nice plugin - use other plugins to do the work for you!

module.exports = {
    name: 'NO-OP - Deep',
    description:
        'A base plugin which does nothing (a NO-OP), slowly, using the noop-slow plugin. Use this to build a plugin.',
    id: 'noop-deep',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'layers',
    usableFrom: ['core', 'gui'],
    process: (args) => {
        return args.runPlugin('noop-slow', args);
    },
};
