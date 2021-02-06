import evalJs from './eval-js';
import { basePluginArgument } from './lib/_test_util';

describe('Eval JS', () => {
    it('Evaluates the input math equation as javascript and returns the result', async () => {
        const input = '5 * 3';
        const expected = '15';

        const output = await evalJs.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Evaluates the input string concatenation as javascript and returns the result', async () => {
        const input = '"test" + " " + "pass" + "!"';
        const expected = 'test pass!';

        const output = await evalJs.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Rejects invalid javascript', async () => {
        const input = '"test" + "fail'; // missing the closing quote at the end of the "fail" string

        await expect(
            evalJs.process({
                ...basePluginArgument,
                textContent: input,
            })
        ).rejects.toThrowError('Invalid or unexpected token');
    });
    it('Runs the provided javascript function and returns the result', async () => {
        const input = 'const test = () => "thing"; return test();';
        const expected = 'thing';

        const output = await evalJs.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
