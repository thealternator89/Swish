import { ProvidedPluginArgument } from './model';
import { unescape } from 'html-escaper';

export = {
    name: 'Unescape HTML',
    description: 'Unescape HTML to get the original text',
    id: 'html-unescape',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'public_off',
    process: async (args: ProvidedPluginArgument) => {
        return unescape(args.textContent);
    },
};
