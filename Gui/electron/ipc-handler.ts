import { BrowserWindow, ipcMain } from 'electron';

import { swishBackend } from './swish-backend';
import { IPCPluginResult } from './model/ipc/plugin';

import { MenuCommand } from '../shared/const/ipc/menu-command';
import { IPC_CHANNELS } from '../shared/const/ipc/ipc-channel';
import { RunPluginResponse } from '../shared/models/ipc/run-plugin-response';

class IPCHandler {
  private win: BrowserWindow;

  constructor() {
    this.registerRunPlugin();
    this.registerSearch();
  }

  public setWindow(window: BrowserWindow) {
    this.win = window;
  }

  public registerSearch() {
    ipcMain.on(IPC_CHANNELS.PLUGIN_SEARCH.REQ, (_event, arg: string) => {
      const matching = swishBackend.search(arg);
      this.sendSearchResult(
        matching.map(
          // Filter out everything we don't want to send.
          ({ id, name, description, author, tags, icon }) => ({
            id,
            name,
            description,
            author,
            tags,
            icon,
          })
        )
      );
    });
  }

  public registerRunPlugin() {
    ipcMain.on(IPC_CHANNELS.RUN_PLUGIN.REQ, async (_event, arg) => {
      const { plugin, data, requestId } = arg;

      let response: RunPluginResponse;
      try {
        response = await swishBackend.runPlugin(plugin, data, requestId);
      } catch (error) {
        response = {
          error: error,
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

  private sendSearchResult(results: IPCPluginResult[]): void {
    this.safeSend(IPC_CHANNELS.PLUGIN_SEARCH.RES, results);
  }

  private safeSend = (channel: string, ...args: any[]) =>
    this?.win?.webContents?.send(channel, ...args);
}

export const ipcHandler = new IPCHandler();
