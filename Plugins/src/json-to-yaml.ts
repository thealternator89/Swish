import * as yaml from 'yaml';

import { ProvidedPluginArgument } from './model';

export = {
    name: 'JSON to YAML',
    description: 'Convert JSON object to YAML',
    id: 'json-to-yaml',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        const parsed = JSON.parse(args.textContent);
        return yaml.stringify(parsed);
    },
};
