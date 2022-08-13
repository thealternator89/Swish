import { app, BrowserWindow } from 'electron';

import { ipcHandler } from './ipc-handler';
import { buildMenus } from './menu-manager';

import * as path from 'path';
import * as url from 'url';

const APP_NAME = 'Swish';

const platformWindowOptions = () => {
  // Hide the titlebar and
  switch (process.platform) {
    case 'darwin': return {
      frame: false,
      titleBarStyle: 'hiddenInset',
    }
    case 'win32': return {
      frame: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1976d2',
        symbolColor: '#fff',
        height: 40
      }
    }
    default: return {
      titleBarStyle: 'default',
    }
  }
}

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
    ...(platformWindowOptions() as any),
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'assets', 'icons', 'png', '64x64.png'),
  });

  win.setMenuBarVisibility(false);

  ipcHandler.setWindow(win);

  win.loadURL(
    url
      .pathToFileURL(path.join(__dirname, '../../../dist/swish-gui/index.html'))
      .toString()
  );

  win.on('closed', () => {
    win = null;
    ipcHandler.setWindow(null);
  });
}
