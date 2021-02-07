import validateJson from './validate-json';
import { basePluginArgument } from './lib/_test_util';

describe('Validate JSON', () => {
    it('Responds with success message if JSON is valid', async () => {
        const input = `{
            "test string": "OK, Go!",
            "bool": true,
            "num": 98
        }`;

        const output = await validateJson.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.message.text).toEqual('JSON is valid');
    });
    it('Throws an error if JSON is invalid', async () => {
        const input = `{
            "test string": "OK, Go!",
            "bool": tru
        }`;

        await expect(
            validateJson.process({
                ...basePluginArgument,
                textContent: input,
            })
        ).rejects.toThrowError();
    });
});
