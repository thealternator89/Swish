import lengthenHex from './lengthen-hex';
import { basePluginArgument } from './lib/_test_util';

describe('Lengthen Hex', () => {
    it('Converts a short hex to a full-length hex', async () => {
        const input = '333';
        const expected = '333333';

        const output = await lengthenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Preserves the prefixed hash if it is on the input', async () => {
        const input = '#333';
        const expected = '#333333';

        const output = await lengthenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Notifies user if provided hex is already full-length', async () => {
        const input = '#333333';

        const output = await lengthenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(input);
        expect(output.message.text).toEqual('Hex is already full-length');
    });
});
