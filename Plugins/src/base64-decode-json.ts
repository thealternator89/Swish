import { ProvidedPluginArgument } from './lib/plugin-definition';
import { runPlugins } from './lib/text-util';

export = {
    name: 'Base-64 Decode JSON',
    description: 'Decode a Base-64 encoded string and format as JSON',
    id: 'base64-decode-json',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'json'],
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        return await runPlugins(
            args.textContent,
            ['base64-decode', 'prettify-json'],
            args.runPlugin
        );
    },
};
