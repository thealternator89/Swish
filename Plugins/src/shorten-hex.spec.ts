import shortenHex from './shorten-hex';
import { basePluginArgument } from './lib/_test_util';

describe('Shorten Hex', () => {
    it('Converts a short hex to a full-length hex', async () => {
        const input = '333333';
        const expected = '333';

        const output = await shortenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Preserves the prefixed hash if it is on the input', async () => {
        const input = '#333333';
        const expected = '#333';

        const output = await shortenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Notifies user if provided hex is already short', async () => {
        const input = '#333';

        const output = await shortenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(input);
        expect(output.message.text).toEqual('Hex is already short');
    });
    it('Notifies user if provided hex unable to be shortened', async () => {
        const input = '#FAFAFA';

        const output = await shortenHex.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(input);
        expect(output.message.text).toEqual(`Hex couldn't be shortened`);
    });
});
