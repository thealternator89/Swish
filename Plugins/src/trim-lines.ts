import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Trim Lines',
    description: 'Remove all whitespace from the start and end of each line',
    id: 'trim-lines',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'content_cut',
    tags: ['trim', 'whitespace'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent
            .split(NEWLINE_CHAR)
            .map((value) => value.trim())
            .join(NEWLINE_CHAR);
    },
};
