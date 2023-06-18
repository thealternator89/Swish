import { Harmonizer } from 'color-harmony';
import { ProvidedPluginArgument } from './model';

type DataResult = {
    selected: Color;
    complementary: Color;
    ranges: {
        shades: string[];
        tints: string[];
        analogous: string[];
        triadic: string[];
    };
};

type Color = {
    hex: {
        long: string;
        short: string;
    };
    rgb: string;
};

export = {
    name: 'Color Tools',
    description: 'Convert between color formats and generate harmonies.',
    tags: ['color', 'hex', 'rgb', 'harmony', 'web'],
    icon: 'color_lens',
    input: {
        type: 'form',
        fields: [
            {
                key: 'color',
                type: 'text',
                label: 'Color (hex/rgb)',
            },
            {
                type: 'label',
                label: '',
            },
            {
                type: 'label',
                label: 'Examples:',
                heading: true,
            },
            {
                type: 'label',
                label: ' ● #ff0000',
            },
            {
                type: 'label',
                label: ' ● #f00',
            },
            {
                type: 'label',
                label: ' ● ffff00',
            },
            {
                type: 'label',
                label: ' ● rgb(255, 0, 0)',
            },
            {
                type: 'label',
                label: ' ● 255, 0, 0',
            },
            {
                type: 'label',
                label: '',
            },
        ],
    },
    process: async (args: ProvidedPluginArgument) => {
        const { color: inputColor } = args.formContent;
        const color = util.parseColorString(inputColor);

        const harmonizer = new Harmonizer();

        const complementary = util.parseColorString(
            harmonizer.harmonize(color.hex.long, [180])[0]
        ); // 180 degrees is complementary, returns an array of one color, so get the first element. Parse so we get all formats.

        const shades = harmonizer.shades(color.hex.long, 7);
        const tints = harmonizer.tints(color.hex.long, 7);

        const analogous = harmonizer.harmonize(color.hex.long, 'analogous');
        const triadic = harmonizer.harmonize(color.hex.long, 'triadic');

        const result = {
            selected: color,
            complementary: complementary,
            ranges: {
                shades: shades,
                tints: tints,
                analogous: analogous,
                triadic: triadic,
            },
        };

        return {
            data: result,
            html: renderHtml(result),
            render: 'html',
            text: renderText(result),
        };
    },
};

const util = {
    lengthenHex: (hex: string) =>
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '#$1$1$2$2$3$3'),
    shortenHex: (hex: string) =>
        hex.replace(/^#?([a-f\d])\1([a-f\d])\2([a-f\d])\3$/i, '#$1$2$3'),
    hexToRgb: (hex: string) => {
        const parsed = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/.exec(hex);

        const r = parseInt(parsed[1], 16);
        const g = parseInt(parsed[2], 16);
        const b = parseInt(parsed[3], 16);
        return `rgb(${r},${g},${b})`;
    },
    rgbToHex: (rgb: string) => {
        const parsed = /^(rgba?)?\(?\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*\)?$/i.exec(
            rgb
        );

        const r = parseInt(parsed[2], 10).toString(16).padStart(2, '0');
        const g = parseInt(parsed[3], 10).toString(16).padStart(2, '0');
        const b = parseInt(parsed[4], 10).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    },
    parseColorString: (colorString: string) => {
        const hexPattern = /^#?([a-f0-9]{3}){1,2}$/i;
        const rgbPattern = /^(rgba?)?\(?\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*\)?$/i;

        let hex: string;
        let rgb: string;

        if (hexPattern.test(colorString)) {
            hex = util.lengthenHex(colorString);
            rgb = util.hexToRgb(hex);
        } else if (rgbPattern.test(colorString)) {
            hex = util.rgbToHex(colorString);
            rgb = util.hexToRgb(hex); // parse back to rgb to normalize
        } else {
            throw new Error('Invalid color string provided.');
        }

        // Fix for if provided hex is missing the '#' symbol
        if (!hex.startsWith('#')) {
            hex = `#${hex}`;
        }

        const shortHex = util.shortenHex(hex);

        return {
            hex: {
                long: hex,
                short: shortHex,
            },
            rgb: rgb,
        };
    },
    colorBrightness: (hex: string) => {
        // Remove '#' symbol if present
        if (hex.startsWith('#')) {
            hex = hex.substring(1);
        }

        // Convert the hex color to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate the relative luminance of the color
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        // Determine if the color is light or dark based on the luminance
        if (luminance > 0.5) {
            return 'light';
        } else {
            return 'dark';
        }
    },
};

const renderHtml = (data: DataResult) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: sans-serif;
        }

        code {
            padding: 2px;
            border-radius: 2px;
            font-weight: bold;
        }

        .padding {
            flex: 1;
        }

        #header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .header-column {
            flex: 1;
        }

        .header-text {
            text-align: center;
        }

        .color-column {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .color-properties {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            align-items: center;
        }

        .color-display {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 1px solid black;
            margin-right: 10px;
        }

        .section-header {
            font-weight: bold;
            font-size:10pt;
            margin-top: 10px;
            margin-bottom: 5px;
        }

        .color-range {
            display: flex;
            flex-direction: row;
        }

        .color-range-item {
            width: 75px;
            height: 45px;
            border: thin solid black;
            font-size: 8pt;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .color-range-item.dark {
            color: #ddd;
        }

        .color-range-item.light {
            color: #333;
        }
    </style>
</head>
<body>
    <div id="header">
${renderHtmlHeaderColumn('Selected Color', data.selected)}
${renderHtmlHeaderColumn('Complementary Color', data.complementary)}
    </div>
    <hr>
    <div class="section-header">Tints and Shades</div>
    ${renderHtmlColorRange(data.ranges.shades)}
    ${renderHtmlColorRange(data.ranges.tints)}
    <div class="section-header">Analogous Colors</div>
    ${renderHtmlColorRange(data.ranges.analogous)}
    <div class="section-header">Triadic Colors</div>
    ${renderHtmlColorRange(data.ranges.triadic)}
</body>
`;

const renderHtmlHeaderColumn = (header: string, color: Color) => `
<div class="header-column">
    <div class="header-text">${header}</div>
    <div class="color-column">
        <div class="color-properties">
            <div class="color-property"><code>${color.hex.short}</code> ${
    color.hex.long !== color.hex.short
        ? `<em>(<code>${color.hex.long}</code>)</em>`
        : ''
}</div>
            <div class="color-property"><code>${color.rgb}</code></div>
        </div>
        <div class="color-display" style="background-color: ${
            color.hex.long
        };"></div>
    </div>
</div>`;

const renderHtmlColorRange = (colors: string[]) => `<div class="color-range">
<div class="padding"></div>
${colors
    .map(
        (color) =>
            `<div class="color-range-item ${util.colorBrightness(
                color
            )}" style="background-color: ${color};">${color}</div>`
    )
    .join('\n')}
<div class="padding"></div>
</div>`;

const renderText = (data: DataResult) =>
    [
        `Selected Color:`,
        `Hex: ${data.selected.hex.short} ${
            data.selected.hex.long !== data.selected.hex.short
                ? `(${data.selected.hex.long})`
                : ''
        }`,
        `RGB: ${data.selected.rgb}`,
        ,
        `Complementary Color:`,
        `Hex: ${data.complementary.hex.short} ${
            data.complementary.hex.long !== data.complementary.hex.short
                ? `(${data.complementary.hex.long})`
                : ''
        }`,
        `RGB: ${data.complementary.rgb}`,
        ,
        `Tints:`,
        `${data.ranges.tints.join(', ')}`,
        ,
        `Shades:`,
        `${data.ranges.shades.join(', ')}`,
        ,
        `Analogous Colors:`,
        `${data.ranges.analogous.join(', ')}`,
        ,
        `Triadic Colors:`,
        `${data.ranges.triadic.join(', ')}`,
    ].join('\n');
