export interface PluginDefinition {
    name: string;
    id?: string;
    description: string;
    author: string;
    tags: string[];
    beepVersion: string;
    process: (args: PluginArgument) => Promise<string|PluginResult>;
}

export interface PluginArgument {
    textContent: string;
    statusUpdate(text: string): void;
    progressUpdate(percent: number): void;
}

export interface PluginResult {
    text?: string;
    message?: {
        text: string;
        level: 'info' | 'warn' | 'success';
    };
}
