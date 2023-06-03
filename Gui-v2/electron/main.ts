import { app, BrowserWindow } from 'electron';

import { ipcHandler } from './ipc-handler';
import { buildMenus } from './menu-manager';

import * as path from 'path';
import * as url from 'url';
import { env } from 'process';

const APP_NAME = 'Swish';

const DEV_MODE = !!env['SWISH_DEVELOPMENT'];

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const platformWindowOptions = () => {
  // Hide the titlebar and
  switch (process.platform) {
    case 'darwin':
      return {
        frame: false,
        titleBarStyle: 'hiddenInset',
      };
    case 'win32':
      return {
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
          color: '#1976d2',
          symbolColor: '#fff',
          height: 40,
        },
      };
    default:
      return {
        titleBarStyle: 'default',
      };
  }
};

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
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'assets', 'icons', 'png', '64x64.png'),
  });

  win.setMenuBarVisibility(false);

  ipcHandler.setWindow(win);

  // If in dev mode, attempt to load the app from the standard angular location
  // Otherwise load the compiled angular app
  if (DEV_MODE) {
    console.log(
      'Running in Dev Mode - will attempt to use ng for live development'
    );
    safeLoadUrl('http://localhost:4200');
  } else {
    win.loadURL(
      url
        .pathToFileURL(
          path.join(__dirname, '../../../dist/swish-gui/index.html')
        )
        .toString()
    );
  }

  win.on('closed', () => {
    win = null;
    ipcHandler.setWindow(null);
  });
}

// Attempt to load a URL in the window
// If it fails, wait a second and try again.
async function safeLoadUrl(url: string, logOnError: boolean = true) {
  try {
    await win.loadURL(url);
  } catch (error) {
    if (logOnError) {
      console.error(
        `Failed to load URL: ${url}. Ng may still be building. Will retry every second.`
      );
    }
    await sleep(1000);
    await safeLoadUrl(url, false);
  }
}
