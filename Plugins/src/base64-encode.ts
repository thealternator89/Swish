import { PluginResult, ProvidedPluginArgument } from './model';

declare function runPlugin(pluginId: string, textContent: string): Promise<PluginResult>;

export = {
    name: 'Base-64 Encode',
    description: 'Encode text as a Base-64 encoded string',
    id: 'base64-encode',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    tags: ['base64', 'encode', 'text', 'json', 'xml'],
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
        let textContent: string;

        switch (format) {
            case 'JSON':
                textContent = (await runPlugin('minify-json', args.textContent)).text;
                break;
            case 'XML':
                textContent = (await runPlugin('minify-xml', args.textContent)).text;
                break;
            default:
                textContent = args.textContent;
        }

        let binaryData = Buffer.from(textContent, 'utf8');
        return binaryData.toString('base64');
    },
};
