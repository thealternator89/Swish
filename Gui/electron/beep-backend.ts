import { PluginDefinition, pluginManager } from 'beep-base';
import { PluginResult } from 'beep-base';
import { configManager } from './config-manager';
import { ipcHandler } from './ipc-handler';

class BeepBackend {

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
