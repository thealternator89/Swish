const format = require('xml-formatter');

export = {
    name: 'Prettify XML',
    description: 'Format XML for easy readability',
    id: 'prettify-xml',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args) => {
        return {
            text: format(args.textContent),
        };
    },
};
