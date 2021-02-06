import { ProvidedPluginArgument } from './model';

export = {
    name: 'Shorten Hex',
    description: 'Shortens a 6-character hex to a 3-character hex',
    id: 'shorten-hex',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'palette',
    process: async (args: ProvidedPluginArgument) => {
        const hex = args.textContent;
        if (!/^#?([0-9a-f]){3,6}$/i.test(hex)) {
            throw new Error('Invalid Hex value - Should be e.g. "#AABBCC"');
        }

        // Only prefix a hash if the input had one prefixed
        const prefix = hex[0] === '#' ? '#' : '';
        const shortened = `${prefix}${hex.replace(
            /^#?([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/i,
            '$1$2$3'
        )}`;

        return {
            text: shortened,
            message: getMessage(hex, shortened),
        };
    },
};

function getMessage(
    original: string,
    shortened: string
): { text: string; status: 'warn' | 'info' } {
    if (shortened === original) {
        if (/^#?([0-9a-f]){3}$/i.test(original)) {
            return {
                text: 'Hex is already short',
                status: 'info',
            };
        }
        if (/^#?([0-9a-f]){6}$/i.test(original)) {
            return {
                text: `Hex couldn't be shortened`,
                status: 'warn',
            };
        }
    }
    return undefined;
}
