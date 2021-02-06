import { ProvidedPluginArgument } from './model';
import { convertWordCaseToPascalCase } from './lib/convert-case';

export = {
    name: 'Sentence to Pascal Case',
    description:
        'Convert each line from a sentence to pascal case (PascalCase)',
    id: 'sentence-to-pascal-case',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'code',
    process: async (args: ProvidedPluginArgument) => {
        return convertWordCaseToPascalCase(args.textContent);
    },
};
