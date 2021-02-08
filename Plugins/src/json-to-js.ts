import { NEWLINE_CHAR } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

export = {
    name: 'JSON to JS',
    description: 'Converts JSON to a static CommonJS exported module',
    id: 'json-to-js',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    process: async (args: ProvidedPluginArgument) => {
        let obj: any;
        try {
            obj = JSON.parse(args.textContent);
        } catch (error) {
            throw new Error('JSON is invalid');
        }

        return `module.exports = ${renderObject(obj)};`;
    },
};

function renderObject(obj: Object, depth: number = 1): string {
    const properties: string[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const prop = obj[key];
            let value;

            if (typeof prop === 'object') {
                value = renderObject(prop, depth + 1);
            } else if (typeof prop === 'string') {
                value = `'${prop}'`;
            } else {
                value = `${prop}`;
            }

            properties.push(`${spaces(depth * 4)}${safeKey(key)}: ${value},`);
        }
    }

    return `{${
        NEWLINE_CHAR +
        properties.join('\n') +
        NEWLINE_CHAR +
        spaces((depth - 1) * 4)
    }}`;
}

const spaces = (num: number) => new Array(num + 1).join(' ');
const safeKey = (key: string) => (/^[a-z]+$/i.test(key) ? key : `'${key}'`);
