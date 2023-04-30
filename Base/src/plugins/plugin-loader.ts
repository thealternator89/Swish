import { PluginDefinition } from 'swish-plugins/dist/model';
import { runPlugins } from '../util/text-utils';
import { logManager } from '../util/log-manager';

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
            // Handle 'aggregate' plugins by converting them to a standard plugin
            .map((plugin) => {
                if (plugin.type === 'aggregate') {
                    return translateAggregatePluginToStandardPlugin(plugin);
                } else {
                    return plugin;
                }
            })
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
        // This forces node to reload the module from disk. Dependencies will still come from the cache though.
        delete require.cache[require.resolve(path)];
        const module = require(path);
        // If the module is an array just return it, otherwise wrap it in an array to simplify handling.
        if (Array.isArray(module)) {
            return module;
        } else {
            return [module];
        }
    } catch (err) {
        logManager.writeError(`Error loading plugin at ${path}: ${err.message}`);
        return new Array(0);
    }
}

function validatePlugin(plugin: any, path: string): boolean {
    // If it's hidden, we can ignore it since it could just be hiding another inbuilt plugin
    if (plugin.hidden) {
        return true;
    }

    const errors = [];

    if (!plugin.name) {
        errors.push('Non-hidden plugins must have a name');
    }

    if (plugin.type === 'aggregate') {
        if (!plugin.plugins || plugin.plugins.length < 1) {
            errors.push(
                "Aggregate plugin must have a 'plugins' property containing at least one plugin ID"
            );
        }
    } else {
        // Plugin isn't an aggregate type
        // Must contain a 'process' property which is a function
        if (!plugin.process || typeof plugin.process !== 'function') {
            errors.push("Plugins must contain a 'process' function");
        }
    }

    if (errors.length) {
        const identifier = plugin.id ?? plugin.name;
        logManager.writeError(
            `Plugin ${identifier} (${path}) has validation errors:\n\t- ${errors.join(
                '\n\t- '
            )}`
        );
    }

    return errors.length === 0;
}

function translateAggregatePluginToStandardPlugin(
    plugin: PluginDefinition
): PluginDefinition {
    return {
        ...plugin,
        process: (args) =>
            runPlugins(args.textContent, plugin.plugins, args.runPlugin),
    };
}
