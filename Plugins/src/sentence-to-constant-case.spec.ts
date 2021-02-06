import constantCase from './sentence-to-constant-case';
import { basePluginArgument } from './lib/_test_util';

describe('Sentence to Constant Case', () => {
    it('Converts a regular sentence to constant case', async () => {
        const input = 'This is a sentence converted to constant case';
        const expected = 'THIS_IS_A_SENTENCE_CONVERTED_TO_CONSTANT_CASE';

        const output = await constantCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
