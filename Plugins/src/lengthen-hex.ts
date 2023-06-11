import { ProvidedPluginArgument } from './model';

export = {
    name: 'Lengthen Hex',
    description: 'Lengthens a 3-character hex to a 6-character hex',
    id: 'lengthen-hex',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'palette',
    tags: ['lengthen', 'hex', 'color', 'web', 'css'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const input = args.textContent;
        const genericHex = generifyHex(input);

        // Only prefix a hash if it was prefixed on the input
        const prefix = input[0] === '#' ? '#' : '';
        const lengthened = `${prefix}${genericHex}`;
        return {
            text: lengthened,
            message: getMessage(input, lengthened),
        };
    },
};

function generifyHex(rawHex: string): string {
    // Standard browser behaviour is for 3-character hex values to be doubled, e.g. #333 === #333333
    if (/^#?[0-9a-f]{3}$/i.test(rawHex)) {
        return rawHex.replace(
            /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,
            '$1$1$2$2$3$3'
        );
    }

    // Just ensure the hash is stripped
    if (/^#?[0-9a-f]{6}$/i.test(rawHex)) {
        return rawHex.replace(/^#?([0-9a-f]{6})$/i, '$1');
    }

    throw new Error(
        "Expected either 3 or 6 hex chars. e.g. '333' or '#FCDEDC'"
    );
}

function getMessage(
    original: string,
    lengthened: string
): { text: string; status: 'info' } {
    if (lengthened === original) {
        return {
            text: 'Hex is already full-length',
            status: 'info',
        };
    }
    return undefined;
}
