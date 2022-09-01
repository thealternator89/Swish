import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { env } from 'process';

const ENV_USER_PLUGINS = 'SWISH_PLUGIN_PATH';
const ENV_CLIP_HOTKEY = 'SWISH_CLIP_HOTKEY';

interface SwishConfig {
    userPlugins?: string;
    editor?: {
        font: string;
        ligatures: boolean;
    };
    clip?: {
        hotkey?: string;
    };
}

class ConfigManager {
    readonly config: object;

    private fileConfig: object;
    private envConfig: object;
    private defaultConfig: object;

    constructor() {
        this.fileConfig = this.readFileConfig();
        this.envConfig = this.getEnvConfig();
        this.defaultConfig = this.getDefaultConfig();

        // Just so other things don't break temporarily
        this.config = {
            ...this.defaultConfig,
            ...this.envConfig,
            ...this.fileConfig,
        };
    }

    public getConfig() {
        return mergeDeep(
            {},
            this.defaultConfig,
            this.fileConfig,
            this.envConfig
        );
    }

    // Specify environment to parse
    public parseEnvironment(
        section: string,
        map: { [key: string]: string }
    ): void {
        const config = {};
        // Create the section in the config, and store in a variable for us to add things to
        const configSection = (config[section] = {});

        for (const envVar of Object.keys(map)) {
            const configKey = map[envVar];
            const configValue = env[envVar];
            if (configValue) {
                configSection[configKey] = configValue;
            }
        }

        // Set the env config from the base, plus the parsed config
        this.envConfig = {
            ...this.getEnvConfig(),
            ...config,
        };
    }

    private readFileConfig(): Partial<SwishConfig> {
        const configPath = join(homedir(), '.swishrc');

        if (!existsSync(configPath)) {
            return {};
        }

        const configContents = readFileSync(configPath, 'utf-8');

        try {
            const config = JSON.parse(configContents);
            return config;
        } catch (ex) {
            console.log(
                `Error loading config file at ${configPath}: ${ex.message}`
            );
        }
    }

    private getEnvConfig(): Partial<SwishConfig> {
        return {
            userPlugins: env[ENV_USER_PLUGINS],
            clip: {
                hotkey: env[ENV_CLIP_HOTKEY],
            },
        };
    }

    private getDefaultConfig(): Partial<SwishConfig> {
        return {
            editor: {
                font: getDefaultFont(),
                ligatures: false,
            },
        };
    }
}

function getDefaultFont(): string {
    switch (process.platform) {
        case 'darwin':
            return 'Menlo';
        case 'win32':
            return 'Consolas';
        default:
            return 'monospace';
    }
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (typeof source[key] === 'undefined') {
                continue;
            }
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export const configManager = new ConfigManager();
