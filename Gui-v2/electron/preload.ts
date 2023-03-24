import { ipcRenderer, contextBridge } from 'electron';
import { configManager } from 'swish-base';

contextBridge.exposeInMainWorld('app', {
  search: async (terms: string) => {
    return ipcRenderer.invoke('pluginSearch', terms);
  },
  runPlugin: (request: any) => {
    ipcRenderer.send('runPlugin', request);

    return new Promise((resolve, reject) => {
      ipcRenderer.once('pluginResult', (_event, arg: any) => {
        resolve(arg);
      });
    });
  },
  getPlugin: async (id: string) => {
    return ipcRenderer.invoke('getPlugin', id);
  },
  hideWindow: () => {
    ipcRenderer.send('hideWindow');
  },
  registerProgressUpdate: (callback) => {
    ipcRenderer.on('pluginProgress', (_event, arg) => callback(arg));
  },
  registerStatusUpdate: (callback) => {
    ipcRenderer.on('pluginStatus', (_event, arg) => callback(arg));
  },
  registerMenuCommands: (callback) => {
    ipcRenderer.on('menuCommand', (_event, arg) => callback(arg));
  },
  config: configManager.config,
});
