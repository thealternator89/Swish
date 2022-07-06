import { ProvidedPluginArgument } from './model';

export = {
    name: 'Shorten Hex',
    description: 'Shortens a 6-character hex to a 3-character hex',
    id: 'shorten-hex',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'palette',
    tags: ['shorten', 'hex', 'color', 'web', 'css'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const hex = args.textContent;
        if (!/^#?([0-9a-f]){3,6}$/i.test(hex)) {
            throw new Error('Invalid Hex value - Should be e.g. "#AABBCC"');
        }

        const shortened = hex.replace(
            /^#?([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/i,
            '$1$2$3'
        );

        // If the replacement failed, we will still have the same hex value as before
        // So we should only add the prefix if we did successfully shorten the hex
        const prefix = hex[0] === '#' ? '#' : '';
        const output = shortened === hex ? hex : `${prefix}${shortened}`;

        return {
            text: output,
            message: getMessage(hex, output),
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
