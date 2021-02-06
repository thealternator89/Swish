/**
 * Unify newlines across different text systems.
 * Converts "\r\n" (CRLF) and "\r" (CR) to "\n" (LF)
 * @param text String to unify the new lines for
 */
export const unifyNewLines = (text: string) =>
    text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
