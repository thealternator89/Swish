import { PluginResult, pluginManager, LoadedPlugin } from 'swish-base';
import { ipcHandler } from './ipc-handler';

class SwishBackend {
  constructor() {
    pluginManager.reloadUserPlugins();
  }

  public search(query: string): LoadedPlugin[] {
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

  public getPlugin(id: string): LoadedPlugin {
    return pluginManager.getPluginById(id);
  }

  public async reloadUserPlugins(): Promise<void> {
    await pluginManager.reloadUserPlugins();
  }

  public getAppVersion(): string {
    return require('../../../package.json').version;
  }
}

export const swishBackend = new SwishBackend();
