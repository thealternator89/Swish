import { ProvidedPluginArgument } from './model';

export = {
    name: 'Prettify JSON',
    description: 'Pretty prints JSON using a unified spacing',
    id: 'prettify-json',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'expand',
    tags: ['json', 'prettify', 'beautify', 'format', 'dev'],
    usableFrom: ['core', 'clip', 'gui'],
    input: {syntax: 'json'},
    process: async (args: ProvidedPluginArgument) => {
        const prettified = JSON.stringify(
            JSON.parse(args.textContent),
            null,
            4
        );

        return {
            text: prettified,
            syntax: 'json'
        };
    },
};
