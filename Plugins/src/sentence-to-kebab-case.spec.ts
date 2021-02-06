import kebabCase from './sentence-to-kebab-case';
import { basePluginArgument } from './lib/_test_util';

describe('Sentence to Kebab Case', () => {
    it('Converts a regular sentence to kebab case', async () => {
        const input = 'This is a sentence converted to kebab case';
        const expected = 'this-is-a-sentence-converted-to-kebab-case';

        const output = await kebabCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
