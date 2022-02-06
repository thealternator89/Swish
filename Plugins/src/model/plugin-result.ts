export interface PluginResult {
    text?: string;
    html?: string;
    rtf?: string;
    message?: {
        text: string;
        level: 'info' | 'warn' | 'success' | 'error';
    };
}
