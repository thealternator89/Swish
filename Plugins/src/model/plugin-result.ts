export interface PluginResult {
    text?: string;
    message?: {
        text: string;
        level: 'info' | 'warn' | 'success' | 'error';
    };
}
