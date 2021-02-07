import decodeUri from './decode-uri-component';
import { basePluginArgument } from './lib/_test_util';

/* We don't need to test much since this is an entirely builtin function to node.
 */

describe('Decode URI Component', () => {
    it('Decodes basic string', async () => {
        const input = 'Hello%20World';
        const expected = 'Hello World';

        const output = await decodeUri.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Decodes an emoji', async () => {
        const input = '%F0%9F%90%B4';
        const expected = '🐴';

        const output = await decodeUri.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
