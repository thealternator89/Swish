class IpcService {
    ipc: any;

    public constructor() {
        this.ipc = (window as any).ipcRenderer;
    }

    searchPlugins(query: string): Promise<any> {
        return window['app'].search(query);
    }

    runPlugin(pluginId: string): void {
        window['app'].runPlugin(pluginId);
    }

    hideWindow(): void {
        window['app'].hideWindow();
    }
}

export const ipcService = new IpcService();
