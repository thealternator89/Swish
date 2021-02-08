import { NEWLINE_CHAR, unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Reverse Lines',
    description: 'Reverses the lines of the input',
    id: 'reverse-lines',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'swap_vert',
    process: async (args: ProvidedPluginArgument) => {
        return unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .reverse()
            .join(NEWLINE_CHAR);
    },
};
