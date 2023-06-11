import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Reverse Lines',
    description: 'Reverses the lines of the input',
    id: 'reverse-lines',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'swap_vert',
    tags: ['reverse', 'text'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent
            .split(NEWLINE_CHAR)
            .reverse()
            .join(NEWLINE_CHAR);
    },
};
