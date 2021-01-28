import { ipcRenderer } from 'electron';

process.once('loaded', () => {
  const win = window as any;
  win.ipcRenderer = ipcRenderer;
  win.platform = process.platform;
});
