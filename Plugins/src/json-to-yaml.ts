import * as yaml from 'yaml';

import { ProvidedPluginArgument } from './model';

export = {
    name: 'JSON to YAML',
    description: 'Convert JSON object to YAML',
    id: 'json-to-yaml',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    tags: ['json', 'yaml', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'json'},
    process: async (args: ProvidedPluginArgument) => {
        const parsed = JSON.parse(args.textContent);
        return {
            text: yaml.stringify(parsed),
            syntax: 'yaml',
        }
    },
};
