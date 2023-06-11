import { ProvidedPluginArgument } from './model';

export = {
    name: 'Hex to RGB',
    description: 'Converts a Hex color value to an RGB color',
    id: 'hex-to-rgb',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'palette',
    tags: ['hex', 'rgb', 'color', 'web', 'css'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const {text: genericHex} = await args.runPlugin(
            'lengthen-hex',
            args.textContent
        );
        const { r, g, b } = longHexToRgb(genericHex);
        const rgbString = `${r},${g},${b}`;
        return `rgb(${rgbString})`;
    },
};

function longHexToRgb(hex: string) {
    // This has come from `lengthen-hex` which would've validated that the hex is of the correct shape
    const parsed = /#?(.{2})(.{2})(.{2})/.exec(hex);

    const r = parseInt(parsed[1], 16);
    const g = parseInt(parsed[2], 16);
    const b = parseInt(parsed[3], 16);

    return { r, g, b };
}
