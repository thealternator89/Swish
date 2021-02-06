export interface PluginArgument {
    textContent: string;
    statusUpdate(text: string): void;
    progressUpdate(percent: number): void;
}
