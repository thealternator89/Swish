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

        return `module.exports = ${getPropertyValue(obj)};`;
    },
};

function getPropertyValue(prop: any, depth: number = 1): string {
    if (Array.isArray(prop)) {
        return renderArray(prop, depth);
    }
    if (typeof prop === 'object') {
        return renderObject(prop, depth);
    }
    if (typeof prop === 'string') {
        return renderString(prop);
    }

    return `${prop}`;
}

function renderObject(obj: Object, depth: number): string {
    const properties: string[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const prop = obj[key];
            let value = getPropertyValue(prop, depth + 1);
            properties.push(`${spaces(depth * 4)}${safeKey(key)}: ${value}`);
        }
    }

    return (
        '{' +
        NEWLINE_CHAR +
        properties.join(',\n') +
        NEWLINE_CHAR +
        spaces((depth - 1) * 4) +
        '}'
    );
}

function renderArray(array: any[], depth: number) {
    return (
        '[' +
        NEWLINE_CHAR +
        spaces(depth * 4) +
        array
            .map((item) => getPropertyValue(item, depth))
            .join(`,\n${spaces(depth * 4)}`) +
        NEWLINE_CHAR +
        spaces((depth - 1) * 4) +
        ']'
    );
}

function renderString(text: string) {
    let stringified = JSON.stringify(text);

    if (text.includes("'")) {
        return stringified;
    }

    // Unwrap the string from double quotes, and unescape any double quotes
    stringified = stringified.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');

    return `'${stringified}'`;
}

const spaces = (num: number) => new Array(num + 1).join(' ');
const safeKey = (key: string) => (/^[a-z]+$/i.test(key) ? key : `'${key}'`);
