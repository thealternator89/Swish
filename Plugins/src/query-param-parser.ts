import { ProvidedPluginArgument } from './model';

export = {
    name: 'Query Parameter Parser',
    description: `Decode URI components to display them in a human-readable way`,
    id: 'query-param-parser',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'travel_explore',
    tags: ['query-param', 'decode', 'web', 'url'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        let text = args.textContent.trim();
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

function splitUriComponent(uriComponent: string): string[] {
    return uriComponent.split('&');
}

function splitKeyValuePair(keyValuePair: string): string[] {
    const kvp = keyValuePair.split('=');
    kvp[1] = decodeURIComponent(kvp[1]);
    return kvp;
}

function buildMarkdownTable(keyValuePairs: string[][]): string {
    const header = buildMarkdownTableRowFromKvp(['Key', 'Value']);
    const separator = buildMarkdownTableRowFromKvp(['---', '---']);
    const rows = keyValuePairs.map((kvp) =>
        buildMarkdownTableRowFromKvp(kvp, true)
    );
    return [header, separator, ...rows].join('\n');
}

function buildTextResult(keyValuePairs: string[][]): string {
    return keyValuePairs.map(textRenderKvp).join('\n');
}

function buildMarkdownTableRowFromKvp(
    kvp: string[],
    monospace?: boolean
): string {
    const [key, value] = kvp.map((i) => (monospace ? `\`${i}\`` : i));
    return `| ${key} | ${value} |`;
}

function textRenderKvp(kvp: string[]): string {
    return `${kvp[0]}: ${kvp[1]}`;
}
