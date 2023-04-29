import { ProvidedPluginArgument } from './model';
import { NEWLINE_CHAR } from './lib/text-util';

const CODE_BLOCK = '```';

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

        const text = buildText(header, payload, signature);
        const markdown = buildMarkdown(header, payload, signature);

        return {
            text,
            markdown,
            render: 'markdown',
        }
    },
};

function indentLines(text: string, spaces: number): string {
    return text
        .split(NEWLINE_CHAR)
        .map((line) => new Array(spaces + 1).join(' ') + line)
        .join(NEWLINE_CHAR);
}

function buildText (header, payload, signature) {
    return [
        'HEADER:',
        indentLines(header, 4),
        ,
        'PAYLOAD:',
        indentLines(payload, 4),
        ,
        'SIGNATURE:',
        indentLines(signature, 4),
    ].join(NEWLINE_CHAR)
}

function buildMarkdown (header, payload, signature) {
    return [
        '**Header:**',
        ...(buildMarkdownCodeBlock(header, 'json')),
        '**Payload:**',
        ...(buildMarkdownCodeBlock(payload, 'json')),
        '**Signature:**',
        ...(buildMarkdownCodeBlock(signature, 'text')),
    ].join(NEWLINE_CHAR);
}

function buildMarkdownCodeBlock (text, lang) {
    return [
        CODE_BLOCK + lang,
        text,
        CODE_BLOCK,
    ];
}

