import jsonToQueryParam from './json-to-query-param';
import { basePluginArgument } from './lib/_test_util';

describe('JSON to Query Param', () => {
    it('Converts basic json object to query params', async () => {
        const inputObj = {
            query: 'test',
            encoding: 'utf8',
        };

        const input = JSON.stringify(inputObj);
        const expected = '?query=test&encoding=utf8';

        const output = await jsonToQueryParam.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Encodes special characters for use in a URL', async () => {
        const inputObj = {
            query: 'test string',
        };

        const input = JSON.stringify(inputObj);
        const expected = '?query=test%20string';

        const output = await jsonToQueryParam.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles emoji', async () => {
        const inputObj = {
            query: '🐴',
        };

        const input = JSON.stringify(inputObj);
        const expected = '?query=%F0%9F%90%B4';

        const output = await jsonToQueryParam.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Stringifies child objects', async () => {
        const inputObj = {
            obj: {
                data: 'ABC123',
            },
        };

        const input = JSON.stringify(inputObj);
        const expected = '?obj=%7B%22data%22%3A%22ABC123%22%7D';

        const output = await jsonToQueryParam.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
