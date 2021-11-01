import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

import { Observable } from 'rxjs';
import { IPC_CHANNELS } from 'shared/const/ipc/ipc-channel';
import { RunPluginRequest } from 'shared/models/ipc/run-plugin-request';
import { PluginResult } from 'swish-base';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  private ipc: IpcRenderer;

  constructor() {
    try {
      this.ipc = (window as any).ipcRenderer;
      console.log('Loaded IPC');
    } catch (error) {
      console.error(
        'Failed to load IPC. Communication with host process will fail.'
      );
    }
  }

  registerMenuCommands(): Observable<string> {
    return new Observable((observer) => {
      this.ipc.on(IPC_CHANNELS.MENU_COMMAND, (_event, arg) =>
        observer.next(arg)
      );
    });
  }

  registerPluginStatusUpdates(): Observable<{ status: string; id: string }> {
    return new Observable((observer) => {
      this.ipc.on(IPC_CHANNELS.PLUGIN_STATUS_UPDATE, (_event, arg) =>
        observer.next(arg)
      );
    });
  }

  registerPluginProgressUpdates(): Observable<{
    percentage: number;
    id: string;
  }> {
    return new Observable((observer) => {
      this.ipc.on(IPC_CHANNELS.PLUGIN_PROGRESS_UPDATE, (_event, arg) =>
        observer.next(arg)
      );
    });
  }

  searchPlugins(query: string): Promise<any> {
    this.ipc.send(IPC_CHANNELS.PLUGIN_SEARCH.REQ, query);
    return new Promise((resolve) => {
      this.ipc.once(IPC_CHANNELS.PLUGIN_SEARCH.RES, (_event, arg) => {
        resolve(arg);
      });
    });
  }

  runPlugin(runPluginRequest: RunPluginRequest): Promise<PluginResult> {
    this.ipc.send(IPC_CHANNELS.RUN_PLUGIN.REQ, runPluginRequest);

    return new Promise((resolve, reject) => {
      this.ipc.once(
        IPC_CHANNELS.RUN_PLUGIN.RES,
        (_event, arg: PluginResult) => {
          resolve(arg);
        }
      );
    });
  }
}
