import { ProvidedPluginArgument } from './model';

export = {
    name: 'Minify JSON',
    description: 'Removes unnecessary whitespace from input JSON',
    id: 'minify-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'compress',
    tags: ['json', 'minify'],
    group: 'Data',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return JSON.stringify(JSON.parse(args.textContent));
    },
};
