import { ProvidedPluginArgument } from './model';

export = {
    name: 'Query Parameter Builder',
    description:
        'Build a query parameter string from a list of key-value pairs',
    id: 'query-param-builder',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'travel_explore',
    tags: ['query-param', 'url', 'internet'],
    input: {
        type: 'form',
        fields: [
            {
                key: 'trimValues',
                label: 'Trim Values',
                type: 'checkbox',
                default: true,
            },
        ],
        includeEditor: true,
        editorPosition: 'top',
    },
    process: async (args: ProvidedPluginArgument) => {
        const { trimValues } = args.formContent ?? { trimValues: true };
        const text = args.textContent;

        const pairs = splitKeyValuePairs(text, trimValues);

        return Object.keys(pairs)
            .map((key) => {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = encodeURIComponent(pairs[key]);
                return `${encodedKey}=${encodedValue}`;
            })
            .join('&');
    },
};

function splitKeyValuePairs(
    text: string,
    trim: boolean
): Record<string, string> {
    const pairs = text.split('\n').map((line) => {
        const key = line.split('=')[0];
        if (!key) {
            return null;
        }
        const value = line.substring(key.length + 1);
        return {
            key: trim ? key.trim() : key,
            value: trim ? value.trim() : value,
        };
    });

    return pairs.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
}
