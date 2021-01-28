import rgbToHex from '../rgb-to-hex';
import { basePluginArgument } from './_util';

describe('RGB to Hex', () => {
    it('Correctly converts an RGB value to a Hex string', async () => {
        const input = '99,128,161';
        const expected = '#6380a1';

        const output = await rgbToHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Truncates to a 3 char hex if possible', async () => {
        const input = '238,204,255';
        const expected = '#ecf';

        const output = await rgbToHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Accepts input wrapped in rgb()', async () => {
        const input = 'rgb(238,204,255)';
        const expected = '#ecf';

        const output = await rgbToHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
});
