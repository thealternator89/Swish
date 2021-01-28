import hexToRgb from '../hex-to-rgb';
import { basePluginArgument } from './_util';

describe('Hex to RGB', () => {
    it('Correctly converts a hex value to RGB', async () => {
        const input = '#6380a1';
        const expected = 'rgb(99,128,161)';

        const output = await hexToRgb.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Converts a 3 char hex correctly', async () => {
        const input = '#ecf';
        const expected = 'rgb(238,204,255)';

        const output = await hexToRgb.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Converts a 6 char hex (which could be truncated) correctly', async () => {
        const input = '#eeccff';
        const expected = 'rgb(238,204,255)';

        const output = await hexToRgb.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it("Converts a hex value without a prefixed '#'", async () => {
        const input = 'ecf';
        const expected = 'rgb(238,204,255)';

        const output = await hexToRgb.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
