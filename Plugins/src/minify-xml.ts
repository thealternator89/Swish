import { ProvidedPluginArgument } from './lib/plugin-definition';

import format from 'xml-formatter';

export = {
    name: 'Minify XML',
    description: 'Removes unnecessary whitespace from input XML',
    id: 'minify-xml',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'compress',
    process: async (args: ProvidedPluginArgument) => {
        return format(args.textContent, {
            lineSeparator: '',
            indentation: '',
        });
    },
};
