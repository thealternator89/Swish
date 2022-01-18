import { BrowserWindow } from 'electron';
declare class IPCHandler {
    private win;
    constructor();
    setWindow(window: BrowserWindow): void;
    registerSearch(): void;
    registerRunPlugin(): void;
    registerHideWindow(): void;
}
export declare const ipcHandler: IPCHandler;
export {};
