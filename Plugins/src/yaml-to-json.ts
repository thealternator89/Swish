import * as yaml from 'yaml';

import { ProvidedPluginArgument } from './model';

export = {
    name: 'YAML to JSON',
    description: 'Convert YAML object to JSON',
    id: 'yaml-to-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    tags: ['yaml', 'json', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'yaml'},
    process: async (args: ProvidedPluginArgument) => {
        const parsed = yaml.parse(args.textContent);
        const json = JSON.stringify(parsed);
        const prettified =  await args.runPlugin('prettify-json', json);
        return {
            text: prettified,
            render: 'text',
            syntax: 'json',
        };
    },
};
