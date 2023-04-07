import { ProvidedPluginArgument } from './model';

export = {
    name: 'Minify JSON',
    description: 'Removes unnecessary whitespace from input JSON',
    id: 'minify-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'compress',
    tags: ['json', 'minify'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'json'},
    process: async (args: ProvidedPluginArgument) => {
        return {
            text: JSON.stringify(JSON.parse(args.textContent)),
            render: 'text',
            syntax: 'json',
        }
    },
};
