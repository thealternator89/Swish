import { ProvidedPluginArgument } from './model';
import { escape } from 'html-escaper';

export = {
    name: 'HTML Escape Text',
    description: 'Escape text to be used in HTML',
    id: 'html-escape',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'public',
    process: async (args: ProvidedPluginArgument) => {
        return escape(args.textContent);
    },
};
