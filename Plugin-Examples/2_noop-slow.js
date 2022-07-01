// Example 2: NO-OP - Slow
//
// This plugin takes a while to do its work.
// It uses 'progressUpdate' and 'statusUpdate' to tell the user what's happening.

module.exports = {
    name: 'NO-OP - Slow',
    description:
        'A base plugin which does nothing (a NO-OP), slowly. Use this to build a plugin.',
    id: 'noop-slow',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'hourglass_top',
    usableFrom: ['core', 'gui'],
    process: async (args) => {
        let percent = 0;

        while (percent < 100) {
            args.progressUpdate(percent);
            if (percent < 20) {
                args.statusUpdate('Starting up');
            } else if (percent < 40) {
                args.statusUpdate('Thinking about it');
            } else if (percent < 60) {
                args.statusUpdate('Working on it');
            } else if (percent < 80) {
                args.statusUpdate('Still working');
            } else {
                args.statusUpdate('Nearly done');
            }
            await sleep(Math.trunc(Math.random() * 3000));
            percent += Math.random() * 15;
        }

        return args.textContent;
    },
};

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
