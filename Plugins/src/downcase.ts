import { ProvidedPluginArgument } from './model';

export = {
    name: 'Downcase',
    description: 'Convert input to lowercase',
    id: 'downcase',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'arrow_downward',
    group: 'Text',
    tags: ['text', 'format', 'lowercase'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.toLowerCase();
    },
};
