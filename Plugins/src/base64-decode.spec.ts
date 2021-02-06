import base64Decode from './base64-decode';
import { basePluginArgument } from './lib/_test_util';

describe('Base64 Decode', () => {
    it('Correctly decodes a Base64 string', async () => {
        const input = 'VGVzdCBzdHJpbmc=';
        const expected = 'Test string';

        const output = await base64Decode.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
