import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Decode JSON Web Token (JWT)',
    description: 'Decodes a JWT and makes it human-readable',
    id: 'decode-jwt',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        const [headerB64, payloadB64, signature] = args.textContent.split('.');
        const [header, payload] = [headerB64, payloadB64]
            .map(decodeBase64)
            .map((str) => JSON.parse(str));

        return [
            'HEADER:',
            indentLines(prettyPrintJson(header), 4),
            ,
            'PAYLOAD:',
            indentLines(prettyPrintJson(payload), 4),
            ,
            'SIGNATURE:',
            indentLines(signature, 4),
        ].join('\n');
    },
};

function indentLines(text: string, spaces: number): string {
    return text
        .split('\n')
        .map((line) => whitespace(spaces) + line)
        .join('\n');
}

function whitespace(num: number) {
    return new Array(num + 1).join(' ');
}

function decodeBase64(text: string): string {
    return Buffer.from(text, 'base64').toString('utf-8');
}

function prettyPrintJson(object: any): string {
    return JSON.stringify(object, null, 4);
}
