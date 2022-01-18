import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Deduplicate lines (content only)',
    description:
        'Removes all duplicate lines, excluding surrounding whitespace and capitalization',
    id: 'dedup-lines-content',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    tags: ['deduplicate', 'content'],
    icon: 'filter_alt',
    usableFrom: ['core', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const lines = args.textContent.split(NEWLINE_CHAR);
        const deduped = deduplicate(lines);
        const result = deduped.join(NEWLINE_CHAR);

        if (deduped.length === lines.length) {
            return {
                text: result,
                message: {
                    text: 'No duplicate lines found',
                    status: 'info',
                },
            };
        } else {
            return {
                text: result,
            };
        }
    },
};

function deduplicate(lines: string[]): string[] {
    const cleanLines = lines.map((line) => line.trim().toLowerCase());
    const output: string[] = [];

    for (let i = 0; i < cleanLines.length; i++) {
        if (cleanLines.indexOf(cleanLines[i]) === i) {
            output.push(lines[i]);
        }
    }

    return output;
}
