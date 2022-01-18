import { ProvidedPluginArgument } from './model';
import { convertWordCaseToPascalCase } from './lib/convert-case';

export = {
    name: 'Sentence to Pascal Case',
    description:
        'Convert each line from a sentence to pascal case (PascalCase)',
    id: 'sentence-to-pascal-case',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    tags: ['pascalcase', 'dev'],
    group: 'Dev',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return convertWordCaseToPascalCase(args.textContent);
    },
};
