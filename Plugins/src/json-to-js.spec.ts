import jsonToJs from './json-to-js';
import { basePluginArgument } from './lib/_test_util';

import requireFromString from 'require-from-string';

/* These tests just do the following basic operations:
 *   * Convert a JS object into JSON
 *   * Pass the object to the plugin
 *   * Attempt to require the response as a CommonJS module
 *   * Assert that the original and required object are identical
 */

describe('JSON to JS', () => {
    it('Converts basic json object to JS object', async () => {
        const inputObj = {
            query: 'test',
            encoding: 'utf8',
        };

        const input = JSON.stringify(inputObj);

        const converted = await jsonToJs.process({
            ...basePluginArgument,
            textContent: input,
        });

        const outputObject = requireFromString(converted);

        expect(outputObject).toEqual(inputObj);
    });
    it('Correctly formats properties containing invalid characters', async () => {
        const inputObj = {
            'query-string': 'test',
            'some property': true,
        };

        const input = JSON.stringify(inputObj);

        const converted = await jsonToJs.process({
            ...basePluginArgument,
            textContent: input,
        });

        const outputObject = requireFromString(converted);

        expect(outputObject).toEqual(inputObj);
    });
});
