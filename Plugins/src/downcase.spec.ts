import downcase from './downcase';
import { basePluginArgument } from './lib/_test_util';

describe('Downcase', () => {
    it('Correctly converts input string to lower case', async () => {
        const input = 'TEST';
        const expected = 'test';

        const output = await downcase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Converts string containing numbers & symbols', async () => {
        const input = 'T3$7 String';
        const expected = 't3$7 string';

        const output = await downcase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Converts string containing emoji', async () => {
        const input = '🧪🧵 - Test String!';
        const expected = '🧪🧵 - test string!';

        const output = await downcase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
