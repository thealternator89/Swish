import { ProvidedPluginArgument } from './model';

export = {
    name: 'JSON to query param',
    description: 'Build a query parameter string from a JSON object',
    id: 'json-to-query-param',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'code',
    process: async (args: ProvidedPluginArgument) => {
        let input: any;
        try {
            input = JSON.parse(args.textContent);
        } catch (error) {
            throw new Error('JSON is invalid');
        }

        const params: string[] = [];

        for (let key in input) {
            if (input.hasOwnProperty(key)) {
                const value = getValueString(input[key]);
                params.push(
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                );
            }
        }

        return '?' + params.join('&');
    },
};

function getValueString(value: string | number | object): string {
    if (typeof value === 'string') {
        return value;
    }

    return JSON.stringify(value);
}
