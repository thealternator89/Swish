import { ProvidedPluginArgument } from './model';
import { NEWLINE_CHAR } from './lib/text-util';

const CODE_BLOCK = '```';

export = {
    name: 'Decode JWT',
    description: 'Decodes a JSON Web Token (JWT) and makes it human-readable',
    id: 'decode-jwt',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'view_agenda',
    tags: ['jwt', 'auth0', 'decode', 'base64', 'token'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const [headerB64, payloadB64] = args.textContent.split('.');

        if (!headerB64 || !payloadB64) {
            throw new Error(
                'Invalid token. Expected format: <header>.<payload>.<signature>'
            );
        }

        const { text: header } = await args.runPlugin('base64-decode', {
            ...args,
            textContent: headerB64,
            formContent: { format: 'JSON' },
        });
        const { text: payload } = await args.runPlugin('base64-decode', {
            ...args,
            textContent: payloadB64,
            formContent: { format: 'JSON' },
        });

        const text = buildText(header, payload);
        const markdown = buildMarkdown(header, payload);

        return {
            text,
            markdown,
            render: 'markdown',
        };
    },
};

function parseDates(json: string): { issuedAt?: Date, notBefore?: Date, expires?: Date } {
    const { iat, nbf, exp } = JSON.parse(json);
    return {
        issuedAt: iat ? new Date(iat * 1000) : null,
        notBefore: nbf ? new Date(nbf * 1000) : null,
        expires: exp ? new Date(exp * 1000) : null,
    };
}

function indentLines(text: string, spaces: number): string {
    return text
        .split(NEWLINE_CHAR)
        .map((line) => new Array(spaces + 1).join(' ') + line)
        .join(NEWLINE_CHAR);
}

function buildText(header: string, payload: string): string {
    const dates = parseDates(payload);
    return [
        'DETAILS:',
        displayDateInformation(dates, false),
        ,
        'PAYLOAD:',
        indentLines(payload, 4),
        ,
        'HEADER:',
        indentLines(header, 4),
    ].join(NEWLINE_CHAR);
}

function buildMarkdown(header: string, payload: string): string {
    const dates = parseDates(payload);
    return [
        '## Details',
        displayDateInformation(dates, true),
        ,
        '## Payload',
        ...buildMarkdownCodeBlock(payload, 'json'),
        '## Header',
        ...buildMarkdownCodeBlock(header, 'json'),
    ].join(NEWLINE_CHAR);
}

function buildMarkdownCodeBlock(text, lang) {
    return [CODE_BLOCK + lang, text, CODE_BLOCK];
}

function displayDateInformation(dates: { issuedAt?: Date, notBefore?: Date, expires?: Date }, markdown: boolean): string {
    const { issuedAt, notBefore, expires } = dates;

    const parts = [];

    if (issuedAt) {
        const isInFuture = issuedAt.getTime() > Date.now();
        parts.push(
            `- ${bold('Issued At:', markdown)} \`${issuedAt.toISOString()}\` ` + (isInFuture ? warning('In the future.', markdown) : ''),
        );
    }

    if (notBefore) {
        const isInFuture = notBefore.getTime() > Date.now();
        parts.push(
            `- ${bold('Not Before:', markdown)} \`${notBefore.toISOString()}\` ` + (isInFuture ? warning('In the future.', markdown) : '')
        );
    }

    if (expires) {
        const isInPast = expires.getTime() < Date.now();
        parts.push(
            `- ${bold('Expires:', markdown)} \`${expires.toISOString()}\` ` + (isInPast ? warning('Expired.', markdown) : '')
        );
    }

    return parts.join(NEWLINE_CHAR);
}

function markdownWarning(message: string): string {
    return `⚠️ _${message}_`;
}

function warning(message: string, markdown: boolean): string {
    return markdown ? markdownWarning(message) : message;
}

function bold(message: string, markdown: boolean): string {
    return markdown ? `**${message}**` : message.toUpperCase();
}
