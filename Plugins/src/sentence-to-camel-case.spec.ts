import camelCase from './sentence-to-camel-case';
import { basePluginArgument } from './lib/_test_util';

describe('Sentence to Camel Case', () => {
    it('Converts a regular sentence to camel case', async () => {
        const input = 'this is a sentence converted to camel case';
        const expected = 'thisIsASentenceConvertedToCamelCase';

        const output = await camelCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Includes acronyms/initialisms as uppercase', async () => {
        const input = 'get IP address from DNS address';
        const expected = 'getIPAddressFromDNSAddress';

        const output = await camelCase.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
