import minifyJson from './minify-json';
import { basePluginArgument } from './lib/_test_util';

describe('Minify JSON', () => {
    it('Minifies JSON', async () => {
        const input = `{
            "something": {
                "isValid": true,
                "number": 32,
                "text": "Swish is Cool!"
            }
        }`;
        const expected =
            '{"something":{"isValid":true,"number":32,"text":"Swish is Cool!"}}';

        const output = await minifyJson.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles emoji', async () => {
        const input = `{
            "something": "❤️",
            "💚": true
        }`;
        const expected = '{"something":"❤️","💚":true}';

        const output = await minifyJson.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
