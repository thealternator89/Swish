import { unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

const NEWLINE_CHAR = '\n';

export = {
    name: 'Sort Lines',
    description: 'Sorts the lines of the input',
    id: 'sort-lines',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'sort',
    process: async (args: ProvidedPluginArgument) => {
        return unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .sort((a, b) => a.localeCompare(b))
            .join(NEWLINE_CHAR);
    },
};
