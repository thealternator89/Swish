import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

import { Observable } from 'rxjs';
import { IPC_CHANNELS } from 'shared/const/ipc/ipc-channel';
import { RunPluginRequest } from 'shared/models/ipc/run-plugin-request';
import { LoadedPlugin } from 'src/models/LoadedPlugin';
import { PluginDefinition, PluginResult } from 'swish-base';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  platform = window['app'].os;
  
  registerMenuCommands(): Observable<string> {
    return new Observable((observer) => {
      window['app'].registerMenuCommands((data) => observer.next(data));
    });
  }

  registerPluginStatusUpdates(): Observable<{ status: string; id: string }> {
    return new Observable((observer) => {
      window['app'].registerStatusUpdate((data) => observer.next(data));
    });
  }

  registerPluginProgressUpdates(): Observable<{
    percentage: number;
    id: string;
  }> {
    return new Observable((observer) => {
      window['app'].registerProgressUpdate((data) => observer.next(data));
    });
  }

  getPlugin(id: string): Promise<LoadedPlugin> {
    return window['app'].getPlugin(id);
  }

  searchPlugins(query: string): Promise<any> {
    return window['app'].search(query);
  }

  runPlugin(runPluginRequest: RunPluginRequest): Promise<PluginResult> {
    return window['app'].runPlugin(runPluginRequest);
  }

  reloadUserPlugins(): Promise<void> {
    return window['app'].reloadUserPlugins();
  }

  getAppVersion(): Promise<string> {
    return window['app'].getAppVersion();
  }
}
