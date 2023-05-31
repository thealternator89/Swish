import { PluginResult, pluginManager, logManager, LoadedPlugin } from 'swish-base';
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

  public getLogs(): LogMessage[] {
    return logManager.getLogs();
  }
}

export const swishBackend = new SwishBackend();
