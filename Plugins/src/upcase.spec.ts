import upcase from './upcase';
import { basePluginArgument } from './lib/_test_util';

describe('Upcase', () => {
    it('Correctly converts input string to lower case', async () => {
        const input = 'test';
        const expected = 'TEST';

        const output = await upcase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Converts string containing numbers & symbols', async () => {
        const input = 'T3$7 String';
        const expected = 'T3$7 STRING';

        const output = await upcase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Converts string containing emoji', async () => {
        const input = '🧪🧵 - Test String!';
        const expected = '🧪🧵 - TEST STRING!';

        const output = await upcase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
});
