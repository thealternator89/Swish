import { NEWLINE_CHAR, unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Shuffle Lines',
    description: 'Shuffles the lines of the input',
    id: 'shuffle-lines',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'shuffle',
    process: async (args: ProvidedPluginArgument) => {
        return unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .sort(() => Math.random() - 0.5)
            .join(NEWLINE_CHAR);
    },
};
