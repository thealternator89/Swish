import { ProvidedPluginArgument } from './model';
import { unescape } from 'html-escaper';

export = {
    name: 'Unescape HTML',
    description: 'Unescape HTML to get the original text',
    id: 'html-unescape',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'public_off',
    tags: ['html', 'web', 'unescape'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return unescape(args.textContent);
    },
};
