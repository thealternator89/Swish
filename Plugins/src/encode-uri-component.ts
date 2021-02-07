import { ProvidedPluginArgument } from './model';

export = {
    name: 'Encode URI Component',
    description: `Encodes text for use in a URI`,
    id: 'encode-uri-component',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'sync',
    process: async (args: ProvidedPluginArgument) => {
        return encodeURIComponent(args.textContent);
    },
};
