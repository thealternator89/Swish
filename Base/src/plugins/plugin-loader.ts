import { PluginDefinition } from 'swish-plugins/dist/model';

export function loadCjsPlugin(
    filename: string,
    path: string,
    condition: (plugin: PluginDefinition) => boolean
): PluginDefinition[] {
    const fullPath = `${path}/${filename}`;
    return (
        safeRequire(fullPath)
            // Filter out invalid plugins
            .filter(
                (plugin) =>
                    (plugin.hidden || // Always include hidden plugins - they don't have the same req's as visible ones
                        checkPropertiesExist(plugin, fullPath, [
                            'name',
                            'description',
                            'author',
                            'swishVersion',
                            'process',
                        ])) &&
                    condition(plugin)
            )
            // Add the plugin id
            .map((plugin, index) => {
                const baseId = filename.substring(0, filename.length - 3); // remove js extension
                const idSuffix = index > 0 ? `-${index}` : '';
                return {
                    id: `${baseId}${idSuffix}`,
                    ...plugin, // If plugin includes an 'id' property, this will be used
                };
            })
    );
}

function safeRequire(path: string): PluginDefinition[] {
    try {
        // Remove the module from the cache (if present)
        // This forces node to fully reload the module from disk. Dependencies will still come from the cache though.
        delete require.cache[require.resolve(path)];
        const module = require(path);
        // If the module is an object, wrap it in an array, otherwise return the array.
        if (Object.prototype.toString.call(module) === '[object Object]') {
            return [module];
        } else {
            return module;
        }
    } catch (err) {
        console.error(`Error loading plugin at ${path}: ${err.message}`);
        return new Array(0);
    }
}

function checkPropertiesExist(
    plugin: any,
    path: string,
    props: string[]
): boolean {
    const missing = props.filter((prop) => !plugin[prop]);

    if (missing.length !== 0) {
        console.error(
            `Plugin ${
                plugin.id ?? plugin.name
            } (${path}) missing properties: ${missing.join(', ')} - Ignoring`
        );
    }

    return missing.length === 0;
}
