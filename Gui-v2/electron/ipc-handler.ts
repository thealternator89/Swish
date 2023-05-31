import { BrowserWindow, ipcMain } from 'electron';

import { PluginResult } from 'swish-base';

import { swishBackend } from './swish-backend';

import { MenuCommand } from '../shared/const/ipc/menu-command';
import { IPC_CHANNELS } from '../shared/const/ipc/ipc-channel';

class IPCHandler {
  private win: BrowserWindow;

  // NOTE: This constructor is special. It will automatically call all register* functions in this class.
  constructor() {
    for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === 'function' && key.startsWith('register')) {
        this[key]();
      }
    }
  }

  public setWindow(window: BrowserWindow) {
    this.win = window;
  }

  public registerSearch() {
    ipcMain.handle(IPC_CHANNELS.PLUGIN_SEARCH.REQ, (_event, {terms, tags}: {terms: string, tags: string[]}) => {
      const matching = swishBackend.search(terms, tags);
      return matching.map(
        // Filter out everything we don't want to send.
        ({ id, name, description, author, tags, icon, systemPlugin }) => ({
          id,
          name,
          description,
          author,
          tags,
          icon,
          systemPlugin,
        })
      );
    });
  }

  public registerGetPlugin() {
    ipcMain.handle(IPC_CHANNELS.GET_PLUGIN.REQ, (_event, arg: string) => {
      const plugin = swishBackend.getPlugin(arg);
      return {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        author: plugin.author,
        tags: plugin.tags,
        icon: plugin.icon,
        systemPlugin: plugin.systemPlugin,
        input: plugin.input,
      };
    });
  }

  public registerRunPlugin() {
    ipcMain.on(IPC_CHANNELS.RUN_PLUGIN.REQ, async (_event, arg) => {
      const { plugin, data, requestId } = arg;

      let response: PluginResult;
      try {
        response = await swishBackend.runPlugin(plugin, data, requestId);
      } catch (error) {
        response = {
          message: {
            level: 'error',
            text: error.message,
          },
        };
      }

      this.safeSend(IPC_CHANNELS.RUN_PLUGIN.RES, response);
    });
  }

  public registerReloadUserPlugins() {
    ipcMain.handle(IPC_CHANNELS.RELOAD_USER_PLUGINS.REQ, () => {
      return swishBackend.reloadUserPlugins();
    });
  }

  public registerGetAppVersion() {
    ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION.REQ, () => {
      return swishBackend.getAppVersion();
    });
  }

  public registerGetLogs() {
    ipcMain.handle(IPC_CHANNELS.GET_LOGS.REQ, () => {
      return swishBackend.getLogs();
    });
  }

  public sendMenuCommand(menuCommand: MenuCommand): void {
    this.safeSend(IPC_CHANNELS.MENU_COMMAND, menuCommand);
  }

  public sendProgressUpdate(percentage: number, runId: string): void {
    this.safeSend(IPC_CHANNELS.PLUGIN_PROGRESS_UPDATE, {
      percentage: percentage,
      id: runId,
    });
  }

  public sendStatusUpdate(status: string, runId: string): void {
    this.safeSend(IPC_CHANNELS.PLUGIN_STATUS_UPDATE, {
      status: status,
      id: runId,
    });
  }

  private safeSend = (channel: string, ...args: any[]) =>
    this?.win?.webContents?.send(channel, ...args);
}

export const ipcHandler = new IPCHandler();
