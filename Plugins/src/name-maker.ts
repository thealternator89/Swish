import { ProvidedPluginArgument } from './model';
import { buildCamelCase, buildConstantCase, buildKebabCase, buildPascalCase, buildSnakeCase } from './lib/convert-case';
import { splitCamelAndPascalCase } from './lib/convert-case';

export = {
    name: 'Name Maker',
    description: 'Create a variable, function or class name from a sentence or phrase',
    id: 'name-maker',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'format_size',
    tags: ['variable', 'method', 'class', 'dev'],
    input: {
        type: 'form',
        fields: [
            {
                key: 'input',
                label: 'Input',
                type: 'text',
                placeholder: 'Enter a phrase to convert to a variable, function or class name',
            },
            {
                key: 'inputCase',
                label: 'Input Case',
                type: 'select',
                opts: ['camelCase / PascalCase', 'CONSTANT_CASE / snake_case', 'kebab-case', 'Sentence case'],
                default: 'Sentence case'
            }
        ]
    }, 
    process: async (args: ProvidedPluginArgument) => {
        const { input, inputCase } = args.formContent;

        let words = [];

        switch (inputCase) {
            case 'camelCase / PascalCase':
                words = splitCamelAndPascalCase(input);
                break;
            case 'CONSTANT_CASE / snake_case':
                words = input.split('_');
                break;
            case 'kebab-case':
                words = input.split('-');
                break;
            case 'Sentence case':
                words = input.split(' ');
                break;
        }

        let md = `
Input: \`${input}\`

Words: \`${JSON.stringify(words)}\`

| Case              | Output                          |
| ----------------- | ------------------------------- |
| **Camel Case**    | \`${buildCamelCase(words)}\`    |
| **Constant Case** | \`${buildConstantCase(words)}\` |
| **Kebab Case**    | \`${buildKebabCase(words)}\`    |
| **Pascal Case**   | \`${buildPascalCase(words)}\`   |
| **Snake Case**    | \`${buildSnakeCase(words)}\`    |
`;
        return {
            markdown: md,
            render: 'markdown'
        };
    }
}
