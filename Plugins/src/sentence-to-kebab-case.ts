import { ProvidedPluginArgument } from './model';
import { convertWordCaseToKebabCase } from './lib/convert-case';

export = {
    name: 'Sentence to Kebab Case',
    description: 'Convert each line from a sentence to kebab case (kebab-case)',
    id: 'sentence-to-kebab-case',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    tags: ['kebabcase', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return convertWordCaseToKebabCase(args.textContent);
    },
};
