import { PluginArgument } from './lib/plugin-definition';
import { convertWordCaseToCamelCase } from './lib/convert-case';

export = {
    name: 'Sentence to Camel Case',
    description: 'Convert each line from a sentence to camel case (camelCase)',
    id: 'sentence-to-camel-case',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        return {
            text: convertWordCaseToCamelCase(args.textContent),
        };
    },
};
