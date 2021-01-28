import { PluginArgument } from './lib/plugin-definition';
import { convertWordCaseToKebabCase } from './lib/convert-case';

export = {
    name: 'Sentence to Kebab Case',
    description: 'Convert each line from a sentence to kebab case (kebab-case)',
    id: 'sentence-to-kebab-case',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        return {
            text: convertWordCaseToKebabCase(args.textContent),
        };
    },
};
