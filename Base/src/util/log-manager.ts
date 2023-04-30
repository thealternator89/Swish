import { LimitedStack } from "./limited-stack";

export type LogLevel = 'warn'|'error';

export interface LogMessage {
    level: LogLevel,
    message: string,
    time: string,
    source?: string,
}

export class Logger {
    constructor (private source: string) {}

    writeWarning(message: string) {
        this.writeLog('warn', message);
    }

    writeError(message: string) {
        this.writeLog('error', message);
    }

    private writeLog(level: LogLevel, message: string) {
        logManager.writeLogObj({
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
        this.logs = new LimitedStack<LogMessage>(50);
    }

    getLogs(): LogMessage[] {
        return this.logs.toList().reverse(); // reverse so newest is first
    }

    /**
     * DO NOT USE THIS METHOD DIRECTLY. Use the Logger class instead.
     * @param data Data to log
     */
    writeLogObj(data: LogMessage) {
        this.logs.push(data);
    }
}

export const logManager = new LogManager();
