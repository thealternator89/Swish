import reverseString from './reverse-string';
import { basePluginArgument } from './lib/_test_util';

describe('Reverse String', () => {
    it('Reverses the input text', async () => {
        const input = 'abcdefghijk';
        const expected = 'kjihgfedcba';

        const output = await reverseString.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles CRLF line endings', async () => {
        const input = 'abcdefghijk\r\nlmnop';
        const expected = 'ponml\nkjihgfedcba';

        const output = await reverseString.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
