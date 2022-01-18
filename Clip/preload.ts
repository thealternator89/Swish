import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('app', {
    search: async (terms: string) => {
        return ipcRenderer.invoke('pluginSearch', terms);
    },
    runPlugin: (pluginId: string) => {
        ipcRenderer.send('runPlugin', pluginId);
    },
    hideWindow: () => {
        ipcRenderer.send('hideWindow');
    },
});
