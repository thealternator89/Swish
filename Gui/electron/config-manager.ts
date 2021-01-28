import * as Configstore from 'configstore';

const PACKAGE_NAME = require('../../../../package.json').name;

const KEY_USER_PLUGIN_PATH = 'userPluginPath';

class ConfigManager {
  private readonly config: Configstore;

  constructor() {
    this.config = new Configstore(PACKAGE_NAME);
  }

  public set userPluginPath(value: string) {
    this.config.set(KEY_USER_PLUGIN_PATH, value);
  }

  public get userPluginPath(): string {
    return this.config.get(KEY_USER_PLUGIN_PATH);
  }

  public getConfig() {
    return {
      userPluginPath: this.userPluginPath,
    };
  }

  public setConfig(config: object) {
    for (const key in config) {
      if (!config.hasOwnProperty(key)) {
        continue;
      }

      switch (key) {
        case KEY_USER_PLUGIN_PATH:
          this.userPluginPath = config[key];
          break;
      }
    }
  }
}

export const configManager = new ConfigManager();
