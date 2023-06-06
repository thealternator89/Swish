import { ProvidedPluginArgument } from './model';

import format from 'xml-formatter';

export = {
    name: 'Prettify XML',
    description: 'Format XML for easy readability',
    id: 'prettify-xml',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'expand',
    tags: ['xml', 'prettify', 'beautify', 'format', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'xml'},
    process: async (args: ProvidedPluginArgument) => {
        return {
            text: format(args.textContent, { collapseContent: true }),
            syntax: 'xml',
        }
    },
};
