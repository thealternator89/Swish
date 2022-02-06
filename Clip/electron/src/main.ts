import {
    app,
    BrowserWindow,
    globalShortcut,
    Menu,
    nativeTheme,
    shell,
    Tray,
} from 'electron';
import * as path from 'path';
import { ipcHandler } from './ipc-handler';
import { exit } from 'process';
import { swishBackend } from './swish-backend';

let mainWindow: BrowserWindow;
let tray: Tray;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        skipTaskbar: true,
    });

    mainWindow.on('blur', () => {
        mainWindow.hide();
    });

    // and load the index.html of the app.
    void mainWindow.loadFile('index.html');

    ipcHandler.setWindow(mainWindow);
}

function createMenu() {
    tray = new Tray(getTrayIconPath());

    tray.setContextMenu(
        Menu.buildFromTemplate([
            { label: 'Show', click: () => mainWindow.show() },
            { type: 'separator' },
            {
                label: 'Reload User Plugins',
                click: () => swishBackend.reloadUserPlugins(),
            },
            {
                label: 'Build your own Plugins!',
                click: () =>
                    shell.openExternal(
                        'https://github.com/thealternator89/Swish/blob/main/docs/PLUGINS.MD'
                    ),
            },
            { type: 'separator' },
            { label: 'Quit', click: () => exit(0) },
        ])
    );
    tray.setToolTip('Swish');

    // Don't show swish on click on Mac, since click opens the menu.
    if (process.platform !== 'darwin') {
        tray.on('click', () => mainWindow.show());
    }
}

function registerHotkey() {
    const config = swishBackend.getConfig();

    if (config?.clip?.hotkey) {
        const ret = globalShortcut.register(config.clip.hotkey, () => {
            mainWindow.show();
        });

        if (!ret) {
            console.log('registration failed');
        }
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createMenu();
    createWindow();
    registerHotkey();
    mainWindow.hide();
});

if (process.platform === 'darwin') {
    app.dock.hide();
}

function getTrayIconPath(state: string = '') {
    let mode = swishBackend.getConfig()?.clip?.iconMode;
    let variation: string;

    // Invert the 'mode' - "dark" in terms of the filename is based on the UI state
    // e.g. the 'dark' icon is white - this would be confusing if we didn't invert it.
    switch (mode) {
        case 'light':
            variation = 'dark';
            break;
        case 'dark':
            variation = 'light';
            break;
        default:
            variation = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    }

    const file = `SwishTray${state}_${variation}.png`;

    return path.join(__dirname, 'assets', 'icons', 'tray', 'png', file);
}
