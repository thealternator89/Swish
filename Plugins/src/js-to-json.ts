import { ProvidedPluginArgument } from './model';

import requireFromString from 'require-from-string';

export = {
    name: 'JS to JSON',
    description: 'Converts a CommonJS module to JSON',
    id: 'js-to-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    usableFrom: ['core', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        let obj: any;
        try {
            obj = requireFromString(args.textContent);
        } catch (error) {
            throw new Error('Input is not a valid CommonJS module');
        }

        return JSON.stringify(obj, null, 4);
    },
};
