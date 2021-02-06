import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Infinite Loop',
    description: 'Plugin which causes an infinite loop',
    id: 'infinite-loop',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        await args.runPlugin('infinite-loop', args);
    },
};
