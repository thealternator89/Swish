import { BrowserWindow, clipboard, ipcMain, Notification } from 'electron';
import * as path from 'path';

import { PluginResult } from 'swish-base';

import { swishBackend } from './swish-backend';
import { IPC_CHANNELS } from '../../shared/ipc-channels';

class IPCHandler {
    private win: BrowserWindow;

    constructor() {
        this.registerRunPlugin();
        this.registerSearch();
        this.registerHideWindow();
    }

    public setWindow(window: BrowserWindow) {
        this.win = window;
    }

    public registerSearch() {
        ipcMain.handle(
            IPC_CHANNELS.PLUGIN_SEARCH.REQ,
            (_event, arg: string) => {
                const matching = swishBackend.search(arg);
                return matching.map(
                    // Filter out all the properties we don't want to send.
                    ({ id, name, description, tags, icon }) => ({
                        id,
                        name,
                        description,
                        tags,
                        icon,
                    })
                );
            }
        );
    }

    public registerRunPlugin() {
        ipcMain.on(IPC_CHANNELS.RUN_PLUGIN.REQ, async (_event, pluginId) => {
            const data = clipboard.readText();

            const startTime = new Date().getTime();

            let response: PluginResult;
            try {
                response = await swishBackend.runPlugin(pluginId, data);
            } catch (error) {
                response = {
                    message: {
                        level: 'error',
                        text: error.message,
                    },
                };
            }
            
            clipboard.write({
                text: response.text,
                html: response.html,
                rtf: response.rtf,
            });

            const pluginName = swishBackend.getPluginName(pluginId);

            if (response.message) {
                // If there's a message from the plugin, display a notification for it.
                showNotification(
                    pluginName,
                    `${response.message.text}`,
                    response.message.level
                );
            } else if (new Date().getTime() - startTime > 3000) {
                // If there's no message, but the plugin took more than 3 seconds to complete, show a "Complete" notification.
                showNotification(pluginName, 'Complete', 'success');
            }
        });
    }

    public registerHideWindow() {
        ipcMain.on(IPC_CHANNELS.WINDOW_HIDE, () => {
            // FIXME: The IPC Handler shouldn't be controlling the visibility of the window.
            this.win.hide();
        });
    }
}

// TODO: move this somewhere that makes sense
function showNotification(
    title: string,
    body: string,
    level: 'info' | 'success' | 'warn' | 'error'
) {
    let bodyPrefix = '';

    switch (level) {
        case 'warn':
            bodyPrefix = 'Warning: ';
            break;
        case 'error':
            bodyPrefix = 'Error: ';
            break;
    }

    new Notification({
        title: title,
        body: bodyPrefix + body,
        icon: path.join(
            __dirname,
            'assets',
            'icons',
            'notification',
            'png',
            'Notification.png'
        ),
    }).show();
}

export const ipcHandler = new IPCHandler();
