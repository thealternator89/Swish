import { ipcRenderer, contextBridge } from 'electron';
import { configManager } from 'swish-base';

contextBridge.exposeInMainWorld('app', {
  search: (terms: string, tags?: string[]) => {
    return ipcRenderer.invoke('pluginSearch', { terms, tags });
  },
  runPlugin: (request: any) => {
    ipcRenderer.send('runPlugin', request);

    return new Promise((resolve) => {
      ipcRenderer.once('pluginResult', (_event, arg: any) => {
        resolve(arg);
      });
    });
  },
  getPlugin: (id: string) => {
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
  reloadUserPlugins: () => {
    return ipcRenderer.invoke('reloadUserPlugins');
  },
  getAppVersion: () => {
    return ipcRenderer.invoke('getAppVersion');
  },
  getLogs: () => {
    return ipcRenderer.invoke('getLogs');
  },
  openExternalUrl: (url: string) => {
    return ipcRenderer.invoke('openExternalUrl', url);
  },
  getConfigValue: (key: string) => {
    return ipcRenderer.invoke('getConfigValue', key);
  },
  setConfigValue: (key: string, value: any) => {
    return ipcRenderer.invoke('setConfigValue', {key, value});
  },
  os: process.platform,
  config: configManager.config,
});
