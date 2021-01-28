import { PluginDefinition, pluginManager } from 'beep-base';
import { PluginResult } from 'beep-base/dist/plugins/plugin-definition';
import { configManager } from './config-manager';
import { ipcHandler } from './ipc-handler';

class BeepBackend {
  readonly plugins: PluginDefinition[];

  constructor() {
    if (configManager.userPluginPath) {
      pluginManager.init(configManager.userPluginPath);
    }

    //TODO: tidy this up
    const userPlugins = pluginManager.getUserPlugins();
    const systemPlugins = pluginManager.getSystemPlugins();

    const tempPlugins = [];
    for (const plugin of userPlugins) {
      if (!tempPlugins.find((existing) => existing.id === plugin.id)) {
        tempPlugins.push(plugin);
      }
    }
    for (const plugin of systemPlugins) {
      if (!tempPlugins.find((existing) => existing.id === plugin.id)) {
        tempPlugins.push(plugin);
      }
    }

    this.plugins = tempPlugins;
  }

  public search(query: string): PluginDefinition[] {
    if (!query) {
      return this.plugins;
    }

    return pluginManager.searchPlugins(query);
  }

  public async runPlugin(
    pluginId: string,
    data: string,
    runId: string
  ): Promise<PluginResult> {
    const plugin = pluginManager.getPluginById(pluginId);
    const result = await plugin.process({
      textContent: data,
      progressUpdate: (percent: number) =>
        ipcHandler.sendProgressUpdate(percent, runId),
      statusUpdate: (status: string) =>
        ipcHandler.sendStatusUpdate(status, runId),
    });

    if (typeof result === 'string') {
      return {
        text: result,
      };
    } else {
      return result;
    }
  }
}

export const beepBackend = new BeepBackend();
