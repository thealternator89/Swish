declare class IpcService {
    ipc: any;
    constructor();
    searchPlugins(query: string): Promise<any>;
    runPlugin(pluginId: string): void;
    hideWindow(): void;
}
export declare const ipcService: IpcService;
export {};
