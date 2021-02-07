import jsonToYaml from './json-to-yaml';
import { basePluginArgument } from './lib/_test_util';

describe('JSON to YAML', () => {
    it('Converts basic json object to YAML', async () => {
        const inputObj = {
            query: 'test',
            encoding: 'utf8',
        };

        const input = JSON.stringify(inputObj);

        const output = await jsonToYaml.process({
            ...basePluginArgument,
            textContent: input,
        });

        // Just check the things we put on the oject are on the YAML string.
        expect(output).toContain('query: test');
        expect(output).toContain('encoding: utf8');
    });
});
