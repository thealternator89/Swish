import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Deduplicate lines',
    description: 'Removes all duplicate lines',
    id: 'dedup-lines',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'filter_alt',
    usableFrom: ['core', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const lines = args.textContent.split(NEWLINE_CHAR);
        const deduped = lines.filter(
            (line, index) => lines.indexOf(line) === index
        );
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
