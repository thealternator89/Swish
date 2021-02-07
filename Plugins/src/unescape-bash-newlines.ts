import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

// looks for any instance of a literal backslash (\) followed by a newline.
const escapedNewlineRegex = /(\\\n)/g;

const trimLines = (lines: string) =>
    lines
        .split(NEWLINE_CHAR)
        .map((line) => line.trimStart())
        .join(NEWLINE_CHAR);

export = {
    name: 'Remove escaped newlines in bash',
    description: 'Remove all escaped newlines in a bash command',
    id: 'unescape-bash-newlines',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'code',
    process: async (args: ProvidedPluginArgument) => {
        const trimmed = trimLines(args.textContent);
        return trimmed.replace(escapedNewlineRegex, '');
    },
};
