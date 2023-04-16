import { PluginResult, ProvidedPluginArgument } from './model';
import { NEWLINE_CHAR, runPlugins } from './lib/text-util';

const PLUGINS = ['base64-decode', 'prettify-json'];

export = {
    name: 'Decode JWT',
    description: 'Decodes a JSON Web Token (JWT) and makes it human-readable',
    id: 'decode-jwt',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'view_agenda',
    tags: ['jwt', 'auth0'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const [headerB64, payloadB64, signature] = args.textContent.split('.');

        if (!headerB64 || !payloadB64 || !signature) {
            throw new Error(
                'Invalid token. Expected format: <header>.<payload>.<signature>'
            );
        }

        const {text: header} = await args.runPlugin('base64-decode-json', headerB64);
        const {text: payload} = await args.runPlugin('base64-decode-json', payloadB64);

        //const header = await base64DecodeJson(headerB64, args.runPlugin);
        //const payload = await base64DecodeJson(payloadB64, args.runPlugin);

        return [
            'HEADER:',
            indentLines(header, 4),
            ,
            'PAYLOAD:',
            indentLines(payload, 4),
            ,
            'SIGNATURE:',
            indentLines(signature, 4),
        ].join(NEWLINE_CHAR);
    },
};

async function base64DecodeJson(
    data: string,
    runPluginFunc: (pluginId: string, args: string) => Promise<PluginResult>
): Promise<string> {
    const {text} = await runPlugins(data, PLUGINS, runPluginFunc);
    return text;
}

function indentLines(text: string, spaces: number): string {
    return text
        .split(NEWLINE_CHAR)
        .map((line) => new Array(spaces + 1).join(' ') + line)
        .join(NEWLINE_CHAR);
}
