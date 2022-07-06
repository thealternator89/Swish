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
    process: async (args: ProvidedPluginArgument) => {
        return format(args.textContent, { collapseContent: true });
    },
};
