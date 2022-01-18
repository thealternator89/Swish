import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Sort Lines',
    description: 'Sorts the lines of the input',
    id: 'sort-lines',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'sort',
    tags: ['sort', 'text'],
    group: 'Text',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent
            .split(NEWLINE_CHAR)
            .sort((a, b) => a.localeCompare(b))
            .join(NEWLINE_CHAR);
    },
};
