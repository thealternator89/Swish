import { BrowserWindow, ipcMain } from 'electron';

import { PluginResult } from 'swish-base';

import { swishBackend } from './swish-backend';
import { IPCPluginResult } from './model/ipc/plugin';

import { MenuCommand } from '../shared/const/ipc/menu-command';
import { IPC_CHANNELS } from '../shared/const/ipc/ipc-channel';

class IPCHandler {
  private win: BrowserWindow;

  constructor() {
    this.registerRunPlugin();
    this.registerSearch();
    this.registerGetPlugin();
  }

  public setWindow(window: BrowserWindow) {
    this.win = window;
  }

  public registerSearch() {
    ipcMain.handle(IPC_CHANNELS.PLUGIN_SEARCH.REQ, (_event, arg: string) => {
      const matching = swishBackend.search(arg);
      return matching.map(
        // Filter out everything we don't want to send.
        ({ id, name, description, author, tags, icon, systemPlugin }) => ({
          id,
          name,
          description,
          author,
          tags,
          icon,
          systemPlugin
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
        input: plugin.input
      }
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
