import { ProvidedPluginArgument } from './model';

export = {
    name: 'String Unescape',
    description: 'Remove slashes from a string',
    id: 'string-unescape',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'format_quote',
    process: async (args: ProvidedPluginArgument) => {
        const text = args.textContent;
        return JSON.parse(`"${escapeSurroundingQuotes(text)}"`);
    },
};

function escapeSurroundingQuotes(text: string): string {
    let temp = text;

    // Starts with an unescaped quote
    if (temp.startsWith('"')) {
        temp = `\\${temp}`;
    }

    // Ends with an unescaped quote
    if (temp.endsWith('"') && !temp.endsWith('\\"')) {
        temp = `${temp.substr(0, temp.length - 1)}\\"`;
    }

    return temp;
}
