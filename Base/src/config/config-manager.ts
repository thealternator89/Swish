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
    readonly config: SwishConfig;

    constructor() {
        const fileConfig = this.readFileConfig();
        const envConfig = this.getEnvConfig();
        const defaultConfig = this.getDefaultConfig();

        this.config = {
            ...defaultConfig,
            ...envConfig,
            ...fileConfig,
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

export const configManager = new ConfigManager();
