import jsToJson from './js-to-json';
import { basePluginArgument } from './lib/_test_util';

describe('JS to JSON', () => {
    it('Processes simple object', async () => {
        const input = `module.exports = {test: 'ok'}`;
        const expected = { test: 'ok' };

        const output = await jsToJson.process({
            ...basePluginArgument,
            textContent: input,
        });

        const outputObj = JSON.parse(output);
        expect(outputObj).toEqual(expected);
    });
    it('Runs simple javascript', async () => {
        const input = `module.exports = {
            fact: factorial(5)
        }
        
        function factorial(num) {
            return num <= 1 ? 1 : num * factorial(num - 1);
        }`;
        const expected = { fact: 120 };

        const output = await jsToJson.process({
            ...basePluginArgument,
            textContent: input,
        });

        const outputObj = JSON.parse(output);
        expect(outputObj).toEqual(expected);
    });
    it('Throws on circular references', async () => {
        const input = `
        const a = {};
        const b = { a: a }
        a.b = b;
        
        module.exports = {
            a: a
        }`;

        await expect(() =>
            jsToJson.process({
                ...basePluginArgument,
                textContent: input,
            })
        ).rejects.toThrowError('Converting circular structure to JSON');
    });
});
