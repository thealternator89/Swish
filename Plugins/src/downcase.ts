import { ProvidedPluginArgument } from './model';

export = {
    name: 'Downcase',
    description: 'Convert input to lowercase',
    id: 'downcase',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'keyboard_arrow_down',
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.toLowerCase();
    },
};
