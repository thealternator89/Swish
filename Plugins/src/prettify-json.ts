import { ProvidedPluginArgument } from './model';

export = {
    name: 'Prettify JSON',
    description: 'Pretty prints JSON using a unified spacing',
    id: 'prettify-json',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'expand',
    process: async (args: ProvidedPluginArgument) => {
        const prettified = JSON.stringify(
            JSON.parse(args.textContent),
            null,
            4
        );

        return {
            text: prettified,
        };
    },
};
