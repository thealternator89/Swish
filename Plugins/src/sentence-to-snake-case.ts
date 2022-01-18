import { ProvidedPluginArgument } from './model';
import { convertWordCaseToSnakeCase } from './lib/convert-case';

export = {
    name: 'Sentence to Snake Case',
    description: 'Convert each line from a sentence to snake case (snake_case)',
    id: 'sentence-to-snake-case',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    tags: ['snakecase', 'dev'],
    group: 'Dev',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return convertWordCaseToSnakeCase(args.textContent);
    },
};
