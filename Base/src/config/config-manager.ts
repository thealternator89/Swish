import { existsSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { env } from 'process';
import { Logger } from '../util/log-manager';

const ENV_USER_PLUGINS = 'SWISH_PLUGIN_PATH';
const ENV_CLIP_HOTKEY = 'SWISH_CLIP_HOTKEY';

const CONFIG_FILE_PATH = join(homedir(), '.swishrc');

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

const logger = new Logger('config-manager');

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
    
    // Get the entire config
    // @deprecated Use getValue instead and specify the key you want
    public getConfig() {
        return mergeDeep(
            {},
            this.defaultConfig,
            this.fileConfig,
            this.envConfig
        );
    }

    // TODO add rxjs and allow for config changes to be observable
    public getValue(key: string, search: any = this.getConfig()): any {
        const keys = key.split(':');
        let value = search;
      
        for (let key of keys) {
          if (value.hasOwnProperty(key)) {
            value = value[key];
          } else {
            return undefined;
          }
        }
      
        return value;
    }

    public setValue(key: string, value: any, temp: boolean = false): void {
        const keys = key.split(':');
        
        let config = this.fileConfig;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i === keys.length - 1) { 
                config[key] = value;
            } else if (!config.hasOwnProperty(key)) {
                config[key] = {};
            }

            config = config[key];
        }

        if (!temp) {
            this.saveConfigFile();
        }
    }

    private saveConfigFile(): void {
        writeFileSync(CONFIG_FILE_PATH, JSON.stringify(this.fileConfig, null, 2));
    }

    private ensureConfigFileExists(): void {
        if (!this.configFileExists()) {
            writeFileSync(CONFIG_FILE_PATH, '{\n\n}');
        }
    }


    // Specify environment to parse
    /**
     * Parse the environment variables into the config based on mapping.
     * The map is a dictionary of environment variable names to config keys.
     * e.g. if the below is passed with the section "clip":
     * {   
     *   "SWISH_CLIP_HOTKEY": "hotkey"
     * }
     * If the environment variable SWISH_CLIP_HOTKEY is set, then the config will be set to:
     * {
     *   // ... the rest of the config
     *   "clip": {
     *     "hotkey": "<value of SWISH_CLIP_HOTKEY>"
     *   }
     * }
     * NOTE: This will overwrite any previously parsed environment. So you can only call this once.
     * @param section The section of the config to store the parsed values in
     * @param map The mapping from environment variables to keys in the config
     */
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

    private configFileExists(): boolean {
        return existsSync(CONFIG_FILE_PATH);
    }

    private readFileConfig(): Partial<SwishConfig> {
        if (!this.configFileExists()) {
            return {};
        }

        const configContents = readFileSync(CONFIG_FILE_PATH, 'utf-8');

        try {
            const config = JSON.parse(configContents);
            return config;
        } catch (ex) {
            logger.writeError(
                `Error loading config file at ${CONFIG_FILE_PATH}\n${ex.message}`
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
