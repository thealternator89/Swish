import { NEWLINE_CHAR, unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Pad Right',
    description:
        'Add padding to the right of each line so all lines are the same length',
    id: 'pad-right',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'format_align_left',
    process: async (args: ProvidedPluginArgument) => {
        const lines = unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .map((line) => line.trim());

        // Find the longest line in the array
        const maxLength = lines.reduce(
            (prev, current) => (prev < current.length ? current.length : prev),
            0
        );

        return lines
            .map((line) => rightPad(line, maxLength))
            .join(NEWLINE_CHAR);
    },
};

function rightPad(text: string, length: number) {
    if (text.length >= length) {
        return text;
    }

    return text + new Array(length - text.length + 1).join(' ');
}
