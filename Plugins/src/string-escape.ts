import { ProvidedPluginArgument } from './model';

export = {
    name: 'String Escape',
    description: 'Escape text for most programming languages',
    id: 'string-escape',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'format_quote',
    process: async (args: ProvidedPluginArgument) => {
        // JSON Stringify, then remove the quotes that got pre/postfixed to the text
        // so we only keep the escaped text
        return JSON.stringify(`${args.textContent}`).replace(
            /^\"?(.*?)\"?$/,
            '$1'
        );
    },
};
