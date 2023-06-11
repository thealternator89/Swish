import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  searchPlugins(query: string, tags?: string[]): Promise<PluginDefinition[]> {
    return window['app'].search(query, tags);
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

  getLogs(): Promise<any> {
    return window['app'].getLogs();
  }
}
