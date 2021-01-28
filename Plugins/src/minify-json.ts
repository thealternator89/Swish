import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'Minify JSON',
    description: 'Removes unnecessary whitespace from input JSON',
    id: 'minify-json',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        return JSON.stringify(JSON.parse(args.textContent));
    },
};
