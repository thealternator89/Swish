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
            .filter((plugin) => validatePlugin(plugin, fullPath))
            // Filter out plugins which don't meet condition
            .filter(condition)
            // Add the plugin id
            .map((plugin, index) => {
                const baseId = filename.substring(0, filename.length - 3); // remove js extension
                const idSuffix = index > 0 ? `-${index}` : '';
                const id = !!plugin.id ? plugin.id : `${baseId}${idSuffix}`;
                return {
                    ...plugin,
                    id: id,
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

function validatePlugin(plugin: any, path: string): boolean {
    if (!plugin.hidden && (!plugin.name || !plugin.process)) {
        console.error(
            `Plugin ${
                plugin.id ?? plugin.name
            } (${path}) missing required properties. 'name' and 'process' are required. - Ignoring`
        );
        return false;
    }
    return true;
}
