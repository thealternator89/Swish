export interface PluginArgument {
    textContent?: string;
    formContent?: {
        [key: string]: any;
    };
    statusUpdate(text: string): void;
    progressUpdate(percent: number): void;
}
