import base64Encode from './base64-encode';
import { basePluginArgument } from './lib/_test_util';

describe('Base64 Encode', () => {
    it('Correctly encodes a Base64 string', async () => {
        const input = 'Test string';
        const expected = 'VGVzdCBzdHJpbmc=';

        const output = await base64Encode.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
