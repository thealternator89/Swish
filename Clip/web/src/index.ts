import { pluginListManager } from './plugin-list-manager';
import { ipcService } from './ipc-service';

const inputElement = document.querySelector(
    '#plugin-search'
) as HTMLInputElement;

inputElement.oninput = () => search();

window.onkeydown = (evt: KeyboardEvent) => {
    switch (evt.key) {
        case 'ArrowUp':
            pluginListManager.prevPlugin();
            break;
        case 'ArrowDown':
            pluginListManager.nextPlugin();
            break;
        case 'Enter':
            const plugin = pluginListManager.getSelectedPlugin();
            if (plugin) {
                ipcService.runPlugin(plugin.id);
                ipcService.hideWindow();
            }
            break;
        case 'Escape':
            ipcService.hideWindow();
            break;
        default:
            return true; // Forward the event
    }

    return false;
};

window.onfocus = reset;

reset();

function reset() {
    inputElement.focus();
    inputElement.selectionStart = 0;
    inputElement.selectionEnd = inputElement.value.length;
    void search();
}

async function search() {
    const result = await ipcService.searchPlugins(inputElement.value);
    pluginListManager.setPluginList(result);
}
