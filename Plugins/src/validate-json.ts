import { ProvidedPluginArgument } from './model';

export = {
    name: 'Validate JSON',
    description:
        'Validates JSON, displaying either an error or a successful message',
    id: 'validate-json',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'check_circle',
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
