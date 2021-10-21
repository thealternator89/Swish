import * as yaml from 'yaml';

import { ProvidedPluginArgument } from './model';

export = {
    name: 'YAML to JSON',
    description: 'Convert YAML object to JSON',
    id: 'yaml-to-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    group: 'Data',
    usableFrom: ['core', 'clip', 'gui'],
    process: (args: ProvidedPluginArgument) => {
        const parsed = yaml.parse(args.textContent);
        const json = JSON.stringify(parsed);
        return args.runPlugin('prettify-json', json);
    },
};
