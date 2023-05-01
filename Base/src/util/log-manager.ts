import { LimitedStack } from "./limited-stack";

type internalLogManager = {
    getLogs(): LogMessage[],
    writeLogObj(data: LogMessage): void,
}

export type LogLevel = 'warn'|'error';

export interface LogMessage {
    level: LogLevel,
    message: string,
    time: string,
    source?: string,
}

/**
 * Logger class for writing messages to the log manager.
 * Note that all messages will be accessible to the user, so only log things that they have the ability to fix.
 * e.g. if something internal fails to act appropriately, don't log that here.
 */
export class Logger {
    constructor (private source: string) {}

    writeWarning(message: string) {
        this.writeLog('warn', message);
    }

    writeError(message: string) {
        this.writeLog('error', message);
    }

    private writeLog(level: LogLevel, message: string) {
        // Hack to make it so the LogManager doesn't expose the writeLogObj method to the outside world
        var manager = logManager as any as internalLogManager;
        manager.writeLogObj({
            level,
            message,
            time: new Date().toISOString(),
            source: this.source
        });
    }
}

class LogManager {
    logs: LimitedStack<LogMessage>;

    constructor() {
        this.logs = new LimitedStack<LogMessage>(20); // TODO figure out a good limit
    }

    getLogs(): LogMessage[] {
        return this.logs.toList().reverse(); // reverse so newest is first
    }

    /**
     * DO NOT USE THIS METHOD DIRECTLY. Use the Logger class instead.
     * @param data Data to log
     */
    private writeLogObj(data: LogMessage) {
        this.logs.push(data);
    }
}

export const logManager = new LogManager();
