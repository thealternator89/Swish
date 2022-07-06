import { ProvidedPluginArgument } from './model';
import { runPlugins } from './lib/text-util';

export = {
    name: 'Base-64 Decode JSON',
    description: 'Decode a Base-64 encoded string and format as JSON',
    id: 'base64-decode-json',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'json'],
    swishVersion: '1.0.0',
    icon: 'code',
    usableFrom: ['core', 'clip', 'gui'],
    process: (args: ProvidedPluginArgument) => {
        return runPlugins(
            args.textContent,
            ['base64-decode', 'prettify-json'],
            args.runPlugin
        );
    },
};
