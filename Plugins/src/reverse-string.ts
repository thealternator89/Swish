import { unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'Reverse String',
    description: 'Reverses a string passed to it. e.g: "ABC123" -> "321CBA"',
    id: 'reverse-string',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'sort',
    process: async (args: ProvidedPluginArgument) => {
        // We have to unify the newlines otherwise we will end up with "LFCR" occurring on CRLF systems
        return unifyNewLines(args.textContent).split('').reverse().join('');
    },
};
