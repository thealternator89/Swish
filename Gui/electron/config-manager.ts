import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { env } from 'process';

const ENV_USER_PLUGINS = 'BEEP_PLUGIN_PATH';

interface BeepConfig {
  userPlugins: string;
  editor: {
    font: string;
    ligatures: boolean;
  };
}

class ConfigManager {
  readonly config: BeepConfig;

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

  private readFileConfig(): Partial<BeepConfig> {
    const configPath = join(homedir(), '.beeprc');

    if (!existsSync(configPath)) {
      return {};
    }

    const configContents = readFileSync(configPath, 'utf-8');

    const config = JSON.parse(configContents);
    return config;
  }

  private getEnvConfig(): Partial<BeepConfig> {
    return {
      userPlugins: env[ENV_USER_PLUGINS],
    };
  }

  private getDefaultConfig(): BeepConfig {
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
