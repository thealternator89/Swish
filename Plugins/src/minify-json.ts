import { ProvidedPluginArgument } from './model';

export = {
    name: 'Minify JSON',
    description: 'Removes unnecessary whitespace from input JSON',
    id: 'minify-json',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'compress',
    process: async (args: ProvidedPluginArgument) => {
        return JSON.stringify(JSON.parse(args.textContent));
    },
};
