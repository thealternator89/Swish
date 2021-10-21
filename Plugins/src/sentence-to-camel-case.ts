import { ProvidedPluginArgument } from './model';
import { convertWordCaseToCamelCase } from './lib/convert-case';

export = {
    name: 'Sentence to Camel Case',
    description: 'Convert each line from a sentence to camel case (camelCase)',
    id: 'sentence-to-camel-case',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    group: 'Dev',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return convertWordCaseToCamelCase(args.textContent);
    },
};
