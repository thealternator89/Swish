/**
 * Unify newlines across different text systems.
 * Converts "\r\n" (CRLF) and "\r" (CR) to "\n" (LF)
 * @param text String to unify the new lines for
 */
export const unifyNewLines = (text: string) =>
    text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');


/**
 * Run a set of plugins in series over input text, passing the output of each plugin as input to the next.
 * The result of the final plugin run is returned.
 * @param input The initial input string
 * @param plugins The plugins to run, as an ordered array
 * @param runPluginFunc The `runPlugin` function passed in plugin arguments
 */
export async function runPlugins(
    input: string,
    plugins: string[],
    runPluginFunc: (pluginId: string, args: string) => Promise<string>
) {
    let value = input;

    for (const plugin of plugins) {
        value = await runPluginFunc(plugin, value);
    }

    return value;
}
