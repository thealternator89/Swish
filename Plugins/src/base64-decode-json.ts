import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Base-64 Decode JSON',
    description: 'Decode a Base-64 encoded string and format as JSON',
    id: 'base64-decode-json',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'json'],
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        const decoded = await args.runPlugin(
            'base64-decode',
            args.textContent,
            'system'
        );
        const json = await args.runPlugin('prettify-json', decoded, 'system');

        return json;
    },
};
