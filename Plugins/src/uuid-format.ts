import { ProvidedPluginArgument } from './model';

const OPTION_LONG = 'Long (8-4-4-4-12)';
const OPTION_SHORT = 'Short (32)';

export = {
    name: 'Format UUID',
    description:
        'Reformat a UUID to either long (8-4-4-4-12) or short (32) format',
    id: 'uuid-format',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'power_input',
    tags: ['uuid', 'format'],
    usableFrom: ['core', 'clip', 'gui'],
    input: {
        type: 'form',
        fields: [
            {
                key: 'output',
                label: 'Output Format',
                type: 'select',
                opts: [OPTION_LONG, OPTION_SHORT],
                default: OPTION_LONG,
            },
        ],
        includeEditor: true,
        editorPosition: 'top',
    },
    process: async (args: ProvidedPluginArgument) => {
        const { output } = args.formContent;

        const uuidRegex = /([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})/;
        const format = output === OPTION_LONG ? '$1-$2-$3-$4-$5' : '$1$2$3$4$5';

        return args.textContent
            .split('\n')
            .map((line) => line.replace(uuidRegex, format))
            .join('\n');
    },
};
