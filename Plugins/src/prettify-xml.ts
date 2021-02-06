import { ProvidedPluginArgument } from './model';

import format from 'xml-formatter';

export = {
    name: 'Prettify XML',
    description: 'Format XML for easy readability',
    id: 'prettify-xml',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'expand',
    process: async (args: ProvidedPluginArgument) => {
        return format(args.textContent, { collapseContent: true });
    },
};
