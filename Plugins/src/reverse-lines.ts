import { ProvidedPluginArgument } from './model';

const NEWLINE_CHAR = '\n';

export = {
    name: 'Reverse Lines',
    description: 'Reverses the lines of the input',
    id: 'reverse-lines',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'sort',
    process: async (args: ProvidedPluginArgument) => {
        const reversed = unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .reverse()
            .join(NEWLINE_CHAR);

        return {
            text: reversed,
        };
    },
};

function unifyNewLines(text: string) {
    return text.replace(/\r\n/g, NEWLINE_CHAR).replace(/\r/g, NEWLINE_CHAR);
}
