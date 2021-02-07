import encodeUri from './encode-uri-component';
import { basePluginArgument } from './lib/_test_util';

/* We don't need to test much since this is an entirely builtin function to node.
 */

describe('Encode URI Component', () => {
    it('Decodes basic string', async () => {
        const input = 'Hello World';
        const expected = 'Hello%20World';

        const output = await encodeUri.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Decodes an emoji', async () => {
        const input = '🐴';
        const expected = '%F0%9F%90%B4';

        const output = await encodeUri.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
