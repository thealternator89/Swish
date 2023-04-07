import { ProvidedPluginArgument } from './model';

import format from 'xml-formatter';

export = {
    name: 'Minify XML',
    description: 'Removes unnecessary whitespace from input XML',
    id: 'minify-xml',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'compress',
    tags: ['xml', 'minify'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'xml'},
    process: async (args: ProvidedPluginArgument) => {
        return {
            text: format(args.textContent, {
                    lineSeparator: '',
                    indentation: '',
                }),
            render: 'text',
            syntax: 'xml',
        }
    },
};
