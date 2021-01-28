import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'Lengthen Hex',
    description: 'Lengthens a 3-character hex to a 6-character hex',
    id: 'lengthen-hex',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        const genericHex = generifyHex(args.textContent);
        return `#${genericHex}`;
    },
};

function generifyHex(rawHex: string): string {
    // Standard browser behaviour is for 3-character hex values to be doubled, e.g. #333 === #333333
    if (/^#?[0-9a-fA-F]{3}$/.test(rawHex)) {
        return rawHex.replace(
            /^#?([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
            '$1$1$2$2$3$3'
        );
    }

    // Just ensure the hash is stripped
    if (/^#?[0-9a-fA-F]{6}$/.test(rawHex)) {
        return rawHex.replace(/^#?([0-9a-fA-F]{6})$/, '$1');
    }

    throw new Error(
        "Expected either 3 or 6 hex chars. e.g. '333' or '#FCDEDC'"
    );
}
