import { ProvidedPluginArgument } from './model';

export = {
    name: 'Reverse String',
    description: 'Reverses a string passed to it. e.g: "ABC123" -> "321CBA"',
    id: 'reverse-string',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'replay',
    tags: ['reverse', 'text'],
    group: 'Text',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.split('').reverse().join('');
    },
};
