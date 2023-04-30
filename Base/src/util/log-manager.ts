import { LimitedStack } from "./limited-stack";

export type LogLevel = 'warn'|'error';

export interface LogMessage {
    level: LogLevel,
    message: string,
    time: string,
}


class LogManager {
    logs: LimitedStack<LogMessage>;

    constructor(private printToConsole: boolean = false) {
        this.logs = new LimitedStack<LogMessage>(50);
    }

    getLogs(): LogMessage[] {
        return this.logs.toList().reverse(); // reverse so newest is first
    }

    writeWarning(message: string) {
        this.writeLog('warn', message);
    }

    writeError(message: string) {
        this.writeLog('error', message);
    }

    writeLog(level: LogLevel, message: string) {
        this.logs.push({
            level,
            message,
            time: new Date().toISOString()
        });
        
        if(this.printToConsole) {
            console.log(`[${level}] ${message}`);
        }
    }
}

//TODO: don't print to console (or make configurable) once this works
export const logManager = new LogManager(true);
