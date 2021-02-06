import { ipcRenderer } from 'electron';
import { configManager } from './config-manager';

process.once('loaded', () => {
  const win = window as any;
  win.ipcRenderer = ipcRenderer;
  win.platform = process.platform;
  win.config = configManager.config;
});
