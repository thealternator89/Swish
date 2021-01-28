import { PluginArgument } from './lib/plugin-definition';

// looks for any instance of a literal backslash (\) followed by a newline.
const escapedNewlineRegex = /(\\\n)/g;

const trimLines = (lines: string) =>
    lines
        .split('\n')
        .map((line) => line.trimStart())
        .join('\n');

export = {
    name: 'Remove escaped newlines in bash',
    description: 'Remove all escaped newlines in a bash command',
    id: 'unescape-bash-newlines',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        const trimmed = trimLines(args.textContent);
        return {
            text: trimmed.replace(escapedNewlineRegex, ''),
        };
    },
};
