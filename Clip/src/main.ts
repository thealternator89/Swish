import {
    app,
    clipboard,
    Tray,
    Menu,
    nativeTheme,
    dialog,
    MenuItem,
    Notification,
} from 'electron';
import { PluginDefinition, configManager, pluginManager } from 'swish-base';
import { exit } from 'process';
import * as path from 'path';

// A sink function which runs but does absolutely nothing.
const SINK_FUNCTION = () => undefined;

if (configManager?.config?.userPlugins) {
    pluginManager.init(configManager.config.userPlugins);
}

let tray;

const defaultContextMenu = Menu.buildFromTemplate([
    ...buildPluginContextItems(),
    // Quit button
    { type: 'separator' },
    { label: 'Quit', click: () => exit(0) },
]);

const runningContextMenu = Menu.buildFromTemplate([
    { label: 'Running, please wait...', enabled: false },
    { type: 'separator' },
    { label: 'Quit', click: () => exit(0) },
]);

app.on('ready', () => {
    tray = new Tray(getTrayIconPath());

    tray.setContextMenu(defaultContextMenu);
    tray.setToolTip('Swish');
});

if (process.platform === 'darwin') {
    app.dock.hide();
}

function buildPluginContextItems(): MenuItem[] {
    const pluginsByGroup = pluginManager.getAllPluginsByGroup();

    const filterPlugins = (plugin: PluginDefinition) =>
        !plugin.usableFrom || plugin.usableFrom.includes('clip');

    const buildMenuItem = (plugin: PluginDefinition) => ({
        label: plugin.name,
        toolTip: plugin.description,
        click: () => runPlugin(plugin),
    });

    const groupMenus = Object.keys(pluginsByGroup)
        .filter((group) => group !== '_other')
        .map((group) => ({
            label: group,
            submenu: pluginsByGroup[group]
                .filter(filterPlugins)
                .map(buildMenuItem),
        })) as any;

    const ungrouped = pluginsByGroup['_other']
        .filter(filterPlugins)
        .map(buildMenuItem);

    return [...groupMenus, ...ungrouped];
}

async function runPlugin(plugin: PluginDefinition) {
    tray.setImage(getTrayIconPath('Active'));
    tray.setContextMenu(runningContextMenu);

    const startTime = new Date().getTime();

    let result;
    try {
        result = await pluginManager.runPlugin(plugin.id, {
            textContent: clipboard.readText(),
            progressUpdate: SINK_FUNCTION,
            statusUpdate: SINK_FUNCTION,
        });
    } catch (error) {
        dialog.showErrorBox(`Error occurred in ${plugin.name}`, error.message);
        tray.setImage(getTrayIconPath());
        tray.setContextMenu(defaultContextMenu);
        return;
    }

    if (result.text) {
        clipboard.writeText(result.text);
    }

    if (result.message) {
        // If there's a message from the plugin, display a notification for it.
        showNotification(
            plugin.name,
            `${result.message.text}`,
            result.message.level
        );
    } else if (new Date().getTime() - startTime > 3000) {
        // If there's no message, but the plugin took more than 3 seconds to complete, show a "Complete" notification.
        showNotification(plugin.name, 'Complete', 'success');
    }

    // Reset the tray and menu
    tray.setImage(getTrayIconPath());
    tray.setContextMenu(defaultContextMenu);
}

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

function getTrayIconPath(state: string = '') {
    const variation = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    const file = `SwishTray${state}_${variation}.png`;

    return path.join(__dirname, 'assets', 'icons', 'tray', 'png', file);
}
