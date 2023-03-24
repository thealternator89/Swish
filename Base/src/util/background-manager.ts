/**
 * Background Manager
 * Monkey patches global setTimeout and setInterval to allow us to cancel them after any plugin has finished executing.
 * This is useful for plugins that need to run code in the background, but we want to make sure they don't continue to run after they return.
 */

class BackgroundManager {
    private originalSetTimeout: ((callback: (...args: any[]) => void, ms: number, ...args: any[]) => NodeJS.Timeout) & typeof setTimeout;
    private originalSetInterval: ((callback: (...args: any[]) => void, ms: number, ...args: any[]) => NodeJS.Timeout) & {
        (handler: TimerHandler, timeout?: number, ...args: any[]): number;
        (callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout;
    };
    private originalClearTimeout: ((timeoutId: NodeJS.Timeout) => void) & {
        (id: number): void;
        (timeoutId: NodeJS.Timeout): void;
    };
    private originalClearInterval: ((intervalId: NodeJS.Timeout) => void) & {
        (id: number): void;
        (intervalId: NodeJS.Timeout): void;
    };

    private timeouts: NodeJS.Timeout[] = [];
    private intervals: NodeJS.Timeout[] = [];

    initialize() {
        this.originalSetTimeout = global.setTimeout;
        this.originalSetInterval = global.setInterval;
        this.originalClearTimeout = global.clearTimeout;
        this.originalClearInterval = global.clearInterval;

        // Monkey patch global functions:

        // setTimeout - to allow us to record the timeout and force it to be cleared when the plugin finishes
        (global.setTimeout as any) = (callback: any, delay: number, ...args: any[]) => {
            const id = this.originalSetTimeout(() =>{
                // Remove the timeout from the list of timeouts after it has been called (since it's no longer active)
                this.timeouts = this.timeouts.filter(x => x !== id);
                callback(...args);
            }, delay);
            this.timeouts.push(id);
            return id;
        }

        // setInterval - to allow us to record the interval and force it to be cleared when the plugin finishes
        (global.setInterval as any) = (callback: any, delay: number, ...args: any[]) => {
            const id = this.originalSetInterval(() => {
                // We don't remove the interval from the list of intervals, since it's still active until clearInterval is called
                callback(...args);
            }, delay);
            this.intervals.push(id);
            return id;
        }

        // clearTimeout - to allow us to remove the timeout from the list of timeouts so we don't have to clear it later
        (global.clearTimeout as any) = (id: NodeJS.Timeout) => {
            this.originalClearTimeout(id);
            this.timeouts = this.timeouts.filter(x => x !== id);
        }

        // clearInterval - to allow us to remove the interval from the list of intervals so we don't have to clear it later
        (global.clearInterval as any) = (id: NodeJS.Timeout) => {
            this.originalClearInterval(id);
            this.intervals = this.intervals.filter(x => x !== id);
        }
    }

    /**
     * Unpatched setTimeout
     * This is useful for internal purposes, as this allows us to manage the timeouts and intervals ourselves, without having to worry about being cleared unexpectedly.
     */
    setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
        return this.originalSetTimeout(callback, ms, ...args);
    }

    /**
     * Unpatched setInterval
     * This is useful for internal purposes, as this allows us to manage the timeouts and intervals ourselves, without having to worry about being cleared unexpectedly.
     */
    setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
        return this.originalSetInterval(callback, ms, ...args);
    }

    dispose(killRemaining?: boolean) {
        // Clear all current timeouts and intervals (and clear the lists of active timeouts and intervals)
        if (killRemaining) {
            this.killActiveBackgroundTasks();
        }

        // Restore original functions
        global.setTimeout = this.originalSetTimeout;
        global.setInterval = this.originalSetInterval;
        global.clearTimeout = this.originalClearTimeout;
        global.clearInterval = this.originalClearInterval;
    }

    // Helper function to kill all active timeouts and intervals
    killActiveBackgroundTasks() {
        const activeTimeouts = this.timeouts.length;
        const activeIntervals = this.intervals.length;

        if (!activeTimeouts && !activeIntervals){
            return;
        }

        console.warn(`Killing ${this.timeouts.length} remaining timeouts and ${this.intervals.length} intervals.`);
        console.warn('This is a sign that a plugin is not properly cleaning up after itself. Please report this to the plugin author.');

        this.killActiveIntervals();
        this.killActiveTimeouts();
    }

    killActiveIntervals() {
        this.intervals.forEach(x => this.originalClearInterval(x));
        this.intervals = [];
    }

    killActiveTimeouts() {
        this.timeouts.forEach(x => this.originalClearTimeout(x));
        this.timeouts = [];
    }
}

export const backgroundManager = new BackgroundManager();
