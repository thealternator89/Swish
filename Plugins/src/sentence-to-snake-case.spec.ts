import snakeCase from './sentence-to-snake-case';
import { basePluginArgument } from './lib/_test_util';

describe('Sentence to Snake Case', () => {
    it('Converts a regular sentence to snake case', async () => {
        const input = 'This is a sentence converted to snake case';
        const expected = 'this_is_a_sentence_converted_to_snake_case';

        const output = await snakeCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
