import { ProvidedPluginArgument } from './model';

export = {
    name: 'String Unescape',
    description: 'Remove slashes from a string',
    id: 'string-unescape',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'format_quote',
    tags: ['unescape', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const text = args.textContent;
        return JSON.parse(`"${removeSurroundingQuotes(text)}"`);
    },
};

function removeSurroundingQuotes(text: string): string {
    // If the input has an unescaped quote on both sides, remove them.
    return text.trim().replace(/^"(.*?[^\\])"$/, '$1');
}
