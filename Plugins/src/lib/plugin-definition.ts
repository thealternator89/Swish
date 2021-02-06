export interface PluginDefinition {
    name: string;
    id?: string;
    description: string;
    author: string;
    tags: string[];
    beepVersion: string;
    icon: string;
    hidden?: boolean;
    process: (args: ProvidedPluginArgument) => Promise<string | PluginResult>;
}

export interface ProvidedPluginArgument extends PluginArgument {
    runPlugin(
        pluginId: string,
        args: string | PluginArgument,
        type?: 'system' | 'user' | 'default'
    ): Promise<string>;
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
