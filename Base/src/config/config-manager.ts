import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { env } from 'process';

const ENV_USER_PLUGINS = 'SWISH_PLUGIN_PATH';

interface SwishConfig {
    userPlugins: string;
    editor: {
        font: string;
        ligatures: boolean;
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

        const config = JSON.parse(configContents);
        return config;
    }

    private getEnvConfig(): Partial<SwishConfig> {
        return {
            userPlugins: env[ENV_USER_PLUGINS],
        };
    }

    private getDefaultConfig(): SwishConfig {
        return {
            editor: {
                font: getDefaultFont(),
                ligatures: false,
            },
            userPlugins: '',
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
