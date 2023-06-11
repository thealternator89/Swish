import { PluginResult, ProvidedPluginArgument } from './model';

declare function runPlugin(pluginId: string, textContent: string): Promise<PluginResult>;

export = {
    name: 'Base-64 Decode',
    description: 'Decode a Base-64 encoded string',
    id: 'base64-decode',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'text', 'json', 'xml'],
    swishVersion: '1.0.0',
    icon: 'code',
    usableFrom: ['core', 'clip', 'gui'],
    input: {
        type: 'form',
        fields: [
            {
                key: 'format',
                label: 'Format',
                type: 'select',
                default: 'Text',
                opts: ['Text', 'JSON', 'XML'],
            },
        ],
        includeEditor: true,
        editorPosition: 'top'
    },
    process: async (args: ProvidedPluginArgument) => {
        const { format } = args.formContent;
        const binaryData = Buffer.from(args.textContent, 'base64');
        const text = binaryData.toString('utf8');

        switch (format) {
            case 'JSON':
                return runPlugin('prettify-json', text);
            case 'XML':
                return runPlugin('prettify-xml', text);
            default:
                return text;
        }
    },
};
