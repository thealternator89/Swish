import stringUnescape from './string-unescape';
import { basePluginArgument } from './lib/_test_util';

describe('String Unescape', () => {
    it('Unescapes special characters in input string', async () => {
        const input = 'test \\" \\\\ string';
        const expected = 'test " \\ string';

        const output = await stringUnescape.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Retains surrounding quotes in input string', async () => {
        const input = '"test \\" \\\\ string"';
        const expected = '"test " \\ string"';

        const output = await stringUnescape.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
