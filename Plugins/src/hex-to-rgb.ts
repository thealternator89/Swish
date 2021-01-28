import { PluginArgument } from './lib/plugin-definition';

export = {
    name: 'Hex to RGB',
    description: 'Converts a Hex color value to an RGB color',
    id: 'hex-to-rgb',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: PluginArgument) => {
        const genericHex = generifyHex(args.textContent);
        const { r, g, b } = longHexToRgb(genericHex);
        const rgbString = `${r},${g},${b}`;
        return `rgb(${rgbString})`;
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

function longHexToRgb(hex) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}
