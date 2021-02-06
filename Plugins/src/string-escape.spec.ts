import stringEscape from './string-escape';
import { basePluginArgument } from './lib/_test_util';

describe('String Escape', () => {
    it('Escapes special characters in input string', async () => {
        const input = 'test " \\ string';
        const expected = 'test \\" \\\\ string';

        const output = await stringEscape.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
