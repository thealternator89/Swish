import { NEWLINE_CHAR, unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Trim Lines',
    description: 'Remove all whitespace from the start and end of each line',
    id: 'trim-lines',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'content_cut',
    process: async (args: ProvidedPluginArgument) => {
        return unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .map((value) => value.trim())
            .join(NEWLINE_CHAR);
    },
};
