import { ProvidedPluginArgument } from './lib/plugin-definition';
import { runPlugins } from './lib/text-util';

const PLUGINS = ['base64-decode', 'prettify-json'];

export = {
    name: 'Decode JSON Web Token (JWT)',
    description: 'Decodes a JWT and makes it human-readable',
    id: 'decode-jwt',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'view_agenda',
    process: async (args: ProvidedPluginArgument) => {
        const [headerB64, payloadB64, signature] = args.textContent.split('.');
        const header = await runPlugins(headerB64, PLUGINS, args.runPlugin);
        const payload = await runPlugins(payloadB64, PLUGINS, args.runPlugin);

        return [
            'HEADER:',
            indentLines(header, 4),
            ,
            'PAYLOAD:',
            indentLines(payload, 4),
            ,
            'SIGNATURE:',
            indentLines(signature, 4),
        ].join('\n');
    },
};

function indentLines(text: string, spaces: number): string {
    return text
        .split('\n')
        .map((line) => new Array(spaces + 1).join(' ') + line)
        .join('\n');
}
