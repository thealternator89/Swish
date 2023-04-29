export interface PluginResult {
    /**
     * The text result
     */
    text?: string;
    html?: string;
    rtf?: string;
    message?: {
        text: string;
        level: 'info' | 'warn' | 'success' | 'error';
    };
    /**
     * The type of result to render - only used by Gui v2 currently
     * @default 'text'
     */
    render?: 'text' | 'message' | 'markdown';

    /**
     * The syntax of the result (if render is 'text') - only used by Gui v2 currently
     * @default 'plaintext'
     */
    syntax?: string;
}
