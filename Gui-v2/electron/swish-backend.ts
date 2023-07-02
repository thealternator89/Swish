import { PluginResult, pluginManager, logManager, LoadedPlugin, configManager } from 'swish-base';
import { ipcHandler } from './ipc-handler';
import { LogMessage } from '../shared/models/log-message';

class SwishBackend {
  constructor() {
    pluginManager.reloadUserPlugins();
  }

  public search(query: string, tags?: string[]): LoadedPlugin[] {
    return pluginManager.searchPlugins(query, tags);
  }

  public async runPlugin(
    pluginId: string,
    data: { textContent?: string; formData?: { [key: string]: any }},
    runId: string
  ): Promise<PluginResult> {
    const result = await pluginManager.runPlugin(pluginId, {
      ...data,
      progressUpdate: (percent: number) =>
        ipcHandler.sendProgressUpdate(percent, runId),
      statusUpdate: (status: string) =>
        ipcHandler.sendStatusUpdate(status, runId),
    });

    return result;
  }

  public getPlugin(id: string): LoadedPlugin {
    return pluginManager.getPluginById(id);
  }

  public async reloadUserPlugins(): Promise<void> {
    await pluginManager.reloadUserPlugins();
  }

  public getAppVersion(): string {
    return require('../../../package.json').version;
  }

  public getLogs(): LogMessage[] {
    return logManager.getLogs();
  }

  /**
   * Gets the value of a configuration key using the standard config resolution order.
   *
   * @param {string} key - The key of the configuration value. Case-sensitive.
   * @param {boolean} global - Indicates whether the configuration is global or scoped to the desktop app.
   * @returns {*} - The value of the configuration key, or undefined if it does not exist.
   */
  public getConfigValue(key: string, global: boolean = false): any | undefined {
    const configKey = global ? key : 'desktop:' + key;
    return configManager.getValue(configKey);
  }

  /**
   * Sets the value of a configuration key in the user config, and saves the config file.
   * Note that if the config is currently set by the environment, this will not have any effect to the user.
   *     You should reload the config using getConfigValue to ensure you get the correct value.
   *
   * @param {string} key - The key of the configuration value. Case-sensitive.
   * @param {*} value - The value to be set.
   * @param {boolean} global - Indicates whether the configuration is global or scoped to the desktop app.
   * @returns {void}
   */
  public setConfigValue(key: string, value: any, global: boolean = false): void {
    const configKey = global ? key : 'desktop:' + key;
    configManager.setValue(configKey, value);
  }
}

export const swishBackend = new SwishBackend();
