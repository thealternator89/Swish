export const NEWLINE_CHAR = '\n';

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
