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
    process: async (args: ProvidedPluginArgument) => {
        return format(args.textContent, {
            lineSeparator: '',
            indentation: '',
        });
    },
};
