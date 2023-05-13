import { ProvidedPluginArgument } from './model';

type parsedColor = { num: number; hex: string };

type rgb = { r: parsedColor; g: parsedColor; b: parsedColor };

export = {
    name: 'RGB to Hex',
    description: 'Converts an RGB color value to a Hex color',
    id: 'rgb-to-hex',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'palette',
    tags: ['hex', 'rgb', 'color', 'web', 'css'],
    usableFrom: ['core', 'clip', 'gui'],
    process: (args: ProvidedPluginArgument) => {
        const { r, g, b } = extractRgb(args.textContent);

        throwIfValueInvalid(r, 'r');
        throwIfValueInvalid(g, 'g');
        throwIfValueInvalid(b, 'b');

        const hexString = `#${r.hex}${g.hex}${b.hex}`;
        return args.runPlugin('shorten-hex', hexString);
    },
};

function extractRgb(rgb: string): rgb {
    let value = /(rgb\()?(\d+),\s?(\d+),\s?(\d+)(\))?/.exec(rgb);

    if (!value) {
        throw new Error(
            "Expected 3 comma-separated numbers. e.g. '255,255,255' or 'rgb(255, 255, 255)'"
        );
    }

    return {
        r: parseColor(value[2]),
        g: parseColor(value[3]),
        b: parseColor(value[4]),
    };
}

const parseColor = (component: string) => {
    const parsed = parseInt(component);
    return { num: parsed, hex: parsed.toString(16).padStart(2, '0') };
};

function throwIfValueInvalid({ num }: parsedColor, component: string) {
    if (num < 0 || num > 255) {
        throw new Error(
            `Expected value of RGB component ${component} to be between 0 and 255. Got ${num}.`
        );
    }
}
