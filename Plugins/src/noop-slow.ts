import { ProvidedPluginArgument } from './model';

export = {
    name: 'NO-OP - Slow',
    description:
        'A base plugin which does nothing (a NO-OP), slowly. Use this to build a plugin.',
    id: 'noop-slow',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
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

function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
