import { ProvidedPluginArgument } from './model';

export = {
    name: 'Validate JSON',
    description:
        'Validates JSON, displaying either an error or a successful message',
    id: 'validate-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'check_circle',
    tags: ['json', 'validate', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'json'},
    process: async (args: ProvidedPluginArgument) => {
        try {
            JSON.parse(args.textContent);
        } catch (error) {
            return {
                message: {
                    text: error.message,
                    level: 'error',
                },
                render: 'message',
            };
        }

        return {
            message: {
                text: 'JSON is valid',
                level: 'success',
            },
            render: 'message'
        };
    },
};
