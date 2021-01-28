import { PluginArgument } from './lib/plugin-definition';
import { convertWordCaseToSnakeCase } from './lib/convert-case';

export = {
    name: 'Sentence to Snake Case',
    description: 'Convert each line from a sentence to snake case (snake_case)',
    id: 'sentence-to-snake-case',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        return {
            text: convertWordCaseToSnakeCase(args.textContent),
        };
    },
};
