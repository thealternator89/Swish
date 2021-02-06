import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'JSON to query param',
    description: 'Build a query parameter string from a JSON object',
    id: 'json-to-query-param',
    author: 'thealternator89',
    beepVersion: '1.0.0',
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
                const value = input[key];
                params.push(`${key}=${value}`);
            }
        }

        return '?' + params.join('&');
    },
};
