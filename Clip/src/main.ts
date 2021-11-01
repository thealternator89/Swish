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

    const groupMenus = Object.keys(pluginsByGroup)
        .filter((group) => group !== '_other')
        .map((group) => ({
            label: group,
            submenu: pluginsByGroup[group]
                .filter(
                    (plugin) =>
                        !plugin.usableFrom || plugin.usableFrom.includes('clip')
                )
                .map((plugin) => ({
                    label: plugin.name,
                    toolTip: plugin.description,
                    click: () => runPlugin(plugin),
                })),
        })) as any;

    const ungrouped = pluginsByGroup['_other']
        .filter(
            (plugin) => !plugin.usableFrom || plugin.usableFrom.includes('clip')
        )
        .map((plugin) => ({
            label: plugin.name,
            toolTip: plugin.description,
            click: () => runPlugin(plugin),
        }));

    return [...groupMenus, ...ungrouped];
}

async function runPlugin(plugin: PluginDefinition) {
    const sink = () => undefined;

    tray.setImage(getTrayIconPath('Active'));
    tray.setContextMenu(runningContextMenu);

    let result;
    try {
        result = await pluginManager.runPlugin(plugin.id, {
            textContent: clipboard.readText(),
            progressUpdate: sink,
            statusUpdate: sink,
        });
    } catch (error) {
        dialog.showErrorBox(`Error occurred in ${plugin.name}`, error.message);
        return;
    }

    if (result.text) {
        clipboard.writeText(result.text);
    }

    if (result.message) {
        showNotification(
            plugin.name,
            `${result.message.text}`,
            result.message.level
        );
    } else {
        showNotification(plugin.name, 'Complete', 'success');
    }

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
        icon: 'assets/icons/notification/png/Notification.png',
    }).show();
}

function getTrayIconPath(state: string = '') {
    const BASE_TRAY_ICON_PATH = 'assets/icons/tray/png';
    const variation = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

    return `${BASE_TRAY_ICON_PATH}/SwishTray${state}_${variation}.png`;
}
