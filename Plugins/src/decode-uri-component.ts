import { ProvidedPluginArgument } from './model';

export = {
    name: 'Decode URI Component',
    description: `Decode a URI component to display the human-readable version`,
    id: 'decode-uri-component',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'emoji_symbols',
    tags: ['decode', 'web', 'url'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        let text = args.textContent;
        if (text.startsWith('?' || '&')) {
            text = text.substring(1);
        }

        const keyValuePairs = splitUriComponent(text).map(splitKeyValuePair);
        return {
            text: buildTextResult(keyValuePairs),
            markdown: buildMarkdownTable(keyValuePairs),
            render: 'markdown',
        };
    },
};


function splitUriComponent (uriComponent: string): string[] {
    return uriComponent.split('&');
}

function splitKeyValuePair (keyValuePair: string): string[] {
    const kvp = keyValuePair.split('=');
    kvp[1] = decodeURIComponent(kvp[1]);
    return kvp;
}



function buildMarkdownTable (keyValuePairs: string[][]): string {
    const header = buildMarkdownTableRowFromKvp(['Key', 'Value']);
    const separator = buildMarkdownTableRowFromKvp(['---', '---']);
    const rows = keyValuePairs.map(buildMarkdownTableRowFromKvp);
    return [header, separator, ...rows].join('\n');
}

function buildTextResult(keyValuePairs: string[][]): string {
    return keyValuePairs.map(textRenderKvp).join('\n');
}

function buildMarkdownTableRowFromKvp(kvp: string[]): string {
    return `| ${kvp[0]} | ${kvp[1]} |`;
}

function textRenderKvp(kvp: string[]): string {
    return `${kvp[0]}: ${kvp[1]}`;
}
