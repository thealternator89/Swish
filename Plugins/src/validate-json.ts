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
    process: async (args: ProvidedPluginArgument) => {
        JSON.parse(args.textContent);

        return {
            message: {
                text: 'JSON is valid',
                level: 'success',
            },
        };
    },
};
