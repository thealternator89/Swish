import { app, BrowserWindow } from 'electron';

import { ipcHandler } from './ipc-handler';
import { buildMenus } from './menu-manager';

import * as path from 'path';
import * as url from 'url';

const APP_NAME = 'Beep';

let win: BrowserWindow;

app.on('ready', () => {
  buildMenus(APP_NAME);
  createWindow();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 400,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcHandler.setWindow(win);

  win.loadURL(
    url
      .pathToFileURL(path.join(__dirname, '../../../dist/beep-gui/index.html'))
      .toString()
  );

  win.on('closed', () => {
    win = null;
    ipcHandler.setWindow(null);
  });
}
