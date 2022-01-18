import { PluginDefinition, PluginResult, pluginManager } from 'swish-base';
import { ipcHandler } from './ipc-handler';

class SwishBackend {
  constructor() {
    pluginManager.reloadUserPlugins();
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
