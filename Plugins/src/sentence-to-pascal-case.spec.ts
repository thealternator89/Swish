import pascalCase from './sentence-to-pascal-case';
import { basePluginArgument } from './lib/_test_util';

describe('Sentence to Pascal Case', () => {
    it('Converts a regular sentence to pascal case', async () => {
        const input = 'This is a sentence converted to pascal case';
        const expected = 'ThisIsASentenceConvertedToPascalCase';

        const output = await pascalCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Includes acronyms/initialisms as uppercase', async () => {
        const input = 'Get IP address from DNS address';
        const expected = 'GetIPAddressFromDNSAddress';

        const output = await pascalCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
