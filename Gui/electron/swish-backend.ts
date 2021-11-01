import {
  PluginDefinition,
  PluginResult,
  pluginManager,
  configManager,
} from 'swish-base';
import { ipcHandler } from './ipc-handler';

class SwishBackend {
  constructor() {
    if (configManager.config.userPlugins) {
      pluginManager.init(configManager.config.userPlugins);
    }
  }

  public search(query: string): PluginDefinition[] {
    return pluginManager.searchPlugins(query);
  }

  public async runPlugin(
    pluginId: string,
    data: string,
    runId: string
  ): Promise<PluginResult> {
    const result = await pluginManager.runPlugin(pluginId, {
      textContent: data,
      progressUpdate: (percent: number) =>
        ipcHandler.sendProgressUpdate(percent, runId),
      statusUpdate: (status: string) =>
        ipcHandler.sendStatusUpdate(status, runId),
    });

    return result;
  }
}

export const swishBackend = new SwishBackend();
