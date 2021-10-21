import {
    app,
    clipboard,
    Tray,
    Menu,
    nativeImage,
    dialog,
    MenuItem,
} from 'electron';
import { PluginDefinition, configManager, pluginManager } from 'swish-base';
import { exit } from 'process';

if (configManager?.config?.userPlugins) {
    pluginManager.init(configManager.config.userPlugins);
}

let tray;

app.on('ready', () => {
    const trayIcon = nativeImage.createFromPath(
        'assets/tray/icons/png/32x32.png'
    );
    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        ...buildPluginContextItems(),
        // Quit button
        { type: 'separator' },
        { label: 'Quit', click: () => exit(0) },
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('Swish');
});

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

    if (typeof result === 'string') {
        clipboard.writeText(result);
        return;
    }

    if (result.text) {
        clipboard.writeText(result.text);
    }

    if (result.message) {
        let level;

        switch (result.level) {
            case 'info':
                level = 'info';
                break;
            case 'warn':
                level = 'warning';
                break;
            default:
                return;
        }

        dialog.showMessageBox(null, {
            message: result.message.text,
            detail: 'Test',
            type: level,
        });
    }
}
