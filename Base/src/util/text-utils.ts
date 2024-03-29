export function identifyLineEndingChar(text: string): '\r\n' | '\r' | '\n' {
    const lineEndings = [
        { char: '\r\n', freq: (text.match(/\r\n/g) ?? []).length },
        { char: '\r', freq: (text.match(/\r[^\n]/g) ?? []).length },
        { char: '\n', freq: (text.match(/[^\r]\n/g) ?? []).length },
    ];

    const mostFrequent = lineEndings.sort((le1, le2) => le2.freq - le1.freq)[0];

    // If the most frequent character has a frequency of 0, use "\n"
    return mostFrequent.freq === 0 ? '\n' : (mostFrequent.char as any);
}

export function unifyLineEndings(
    text: string,
    lineEndingChar: '\r\n' | '\r' | '\n' = '\n'
): string {
    const unified = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return unified.replace(/\n/g, lineEndingChar);
}

export async function runPlugins(
    input: string,
    plugins: string[],
    runPluginFunc: (
        pluginId: string,
        args: string,
        type?: string
    ) => Promise<string>
): Promise<string> {
    let currentValue = input;

    for (const plugin of plugins) {
        const [pluginType, pluginId] = plugin.split(':');

        if (pluginType === 'user' || pluginType === 'system') {
            currentValue = await runPluginFunc(
                pluginId,
                currentValue,
                pluginType
            );
        } else {
            currentValue = await runPluginFunc(plugin, currentValue);
        }
    }

    return currentValue;
}
