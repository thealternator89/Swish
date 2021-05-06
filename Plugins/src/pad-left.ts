import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Pad Left',
    description:
        'Add padding to the left of each line so all lines are the same length',
    id: 'pad-left',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'format_align_right',
    process: async (args: ProvidedPluginArgument) => {
        const lines = args.textContent
            .split(NEWLINE_CHAR)
            .map((line) => line.trim());
        const maxLength = lines.reduce(
            (prev, current) => (prev < current.length ? current.length : prev),
            0
        );
        return lines.map((line) => leftPad(line, maxLength)).join(NEWLINE_CHAR);
    },
};

function leftPad(text: string, length: number) {
    if (text.length >= length) {
        return text;
    }

    return new Array(length - text.length + 1).join(' ') + text;
}
