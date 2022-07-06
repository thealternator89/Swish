import { ProvidedPluginArgument } from './model';
import { convertWordCaseToConstantCase } from './lib/convert-case';

export = {
    name: 'Sentence to Constant Case',
    description:
        'Convert each line from a sentence to constant case (CONSTANT_CASE)',
    id: 'sentence-to-constant-case',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    tags: ['constantcase', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return convertWordCaseToConstantCase(args.textContent);
    },
};
