/**
 * Background Manager
 * Monkey patches global setTimeout and setInterval to allow us to cancel them after any plugin has finished executing.
 * This is useful for plugins that need to run code in the background, but we want to make sure they don't continue to run after they return.
 */

import { Logger } from './log-manager';

const logger = new Logger('background-manager');

// Switch between a singular and plural word based on the specified count
// Assumes the plural word should be used for 0 and negative values for count
function pluralizeWord(
    singularWord: string,
    pluralWord: string,
    count: number
) {
    return count === 1 ? singularWord : pluralWord;
}

class BackgroundManager {
    private originalSetTimeout: ((
        callback: (...args: any[]) => void,
        ms: number,
        ...args: any[]
    ) => NodeJS.Timeout) &
        typeof setTimeout;
    private originalSetInterval: ((
        callback: (...args: any[]) => void,
        ms: number,
        ...args: any[]
    ) => NodeJS.Timeout) & {
        (handler: TimerHandler, timeout?: number, ...args: any[]): number;
        (
            callback: (...args: any[]) => void,
            ms: number,
            ...args: any[]
        ): NodeJS.Timeout;
    };
    private originalClearTimeout: ((timeoutId: NodeJS.Timeout) => void) & {
        (id: number): void;
        (timeoutId: NodeJS.Timeout): void;
    };
    private originalClearInterval: ((intervalId: NodeJS.Timeout) => void) & {
        (id: number): void;
        (intervalId: NodeJS.Timeout): void;
    };

    private initialized = false;

    private timeouts: NodeJS.Timeout[] = [];
    private intervals: NodeJS.Timeout[] = [];

    initialize() {
        if (this.initialized) {
            console.warn('Background Manager already initialized.');
            return;
        }

        // Monkey patch global functions:
        this.patchSetTimeout();
        this.patchSetInterval();
        this.patchClearTimeout();
        this.patchClearInterval();

        this.initialized = true;
    }

    dispose(killRemaining?: boolean) {
        if (!this.initialized) {
            console.warn('Background Manager not initialized.');
            return;
        }

        // Clear all current timeouts and intervals (and clear the lists of active timeouts and intervals)
        if (killRemaining) {
            this.killActiveBackgroundTasks();
        } else {
            // Stop tracking the timeouts and intervals, but don't kill them
            this.intervals = [];
            this.timeouts = [];
        }

        // Restore original functions
        global.setTimeout = this.originalSetTimeout;
        global.setInterval = this.originalSetInterval;
        global.clearTimeout = this.originalClearTimeout;
        global.clearInterval = this.originalClearInterval;

        this.initialized = false;
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
    setInterval(
        callback: (...args: any[]) => void,
        ms: number,
        ...args: any[]
    ) {
        return this.originalSetInterval(callback, ms, ...args);
    }

    /**
     * Helper function to kill all active timeouts and intervals
     * @param pluginId The ID of the plugin that is being unloaded. If not specified, it is assumed that this is running as part of the plugin loading process.
     * @param force If true, kill all active timeouts and intervals even if the background manager is not initialized.
     */
    killActiveBackgroundTasks(pluginId?: string, force = false) {
        if (!force && !this.initialized) {
            console.warn('Background Manager not initialized.');
            return;
        }

        const killedIntervals = this.killActiveIntervals();
        const killedTimeouts = this.killActiveTimeouts();

        const killed = killedIntervals + killedTimeouts;

        if (killed > 0) {
            const pluralized = {
                task: pluralizeWord('task', 'tasks', killed),
                was: pluralizeWord('was', 'were', killed),
                has: pluralizeWord('has', 'have', killed),
            };

            if (pluginId) {
                logger.writeWarning(
                    `${killed} background ${pluralized.task} ${pluralized.was} left over after a plugin (${pluginId}) finished executing and ${pluralized.has} been killed.\nThis is likely a bug in the plugin - please report it to the plugin author.`
                );
            } else {
                logger.writeWarning(
                    `${killed} background ${pluralized.task} ${pluralized.was} left over after user plugins were loaded and ${pluralized.has} been killed.\nPlugins should not leave background tasks running during initialization.`
                );
            }
        }
    }

    killActiveIntervals(): number {
        const numIntervals = this.intervals.length;
        this.intervals.forEach((x) => this.originalClearInterval(x));
        this.intervals = [];

        return numIntervals;
    }

    killActiveTimeouts(): number {
        const numTimeouts = this.timeouts.length;
        this.timeouts.forEach((x) => this.originalClearTimeout(x));
        this.timeouts = [];

        return numTimeouts;
    }

    /**
     * Patch clearInterval to remove the interval from the list of intervals
     */
    private patchClearInterval() {
        this.originalClearInterval = global.clearInterval;
        (global.clearInterval as any) = (id: NodeJS.Timeout) => {
            this.originalClearInterval(id);
            this.intervals = this.intervals.filter((x) => x !== id);
        };
    }

    /**
     * Patch clearTimeout to remove the timeout from the list of timeouts
     */
    private patchClearTimeout() {
        this.originalClearTimeout = global.clearTimeout;
        (global.clearTimeout as any) = (id: NodeJS.Timeout) => {
            this.originalClearTimeout(id);
            this.timeouts = this.timeouts.filter((x) => x !== id);
        };
    }

    /**
     * Patch setInterval to record the interval so we can clear it later
     */
    private patchSetInterval() {
        this.originalSetInterval = global.setInterval;
        (global.setInterval as any) = (
            callback: any,
            delay: number,
            ...args: any[]
        ) => {
            const id = this.originalSetInterval(() => {
                // We don't remove the interval from the list of intervals, since it's still active until clearInterval is called
                callback(...args);
            }, delay);
            this.intervals.push(id);
            return id;
        };
    }

    /**
     * Patch setTimeout to record the timeout so we can clear it later
     */
    private patchSetTimeout() {
        this.originalSetTimeout = global.setTimeout;
        (global.setTimeout as any) = (
            callback: any,
            delay: number,
            ...args: any[]
        ) => {
            const id = this.originalSetTimeout(() => {
                // Remove the timeout from the list of timeouts after it has been called (since it's no longer active)
                this.timeouts = this.timeouts.filter((x) => x !== id);
                callback(...args);
            }, delay);
            this.timeouts.push(id);
            return id;
        };
    }
}

export const backgroundManager = new BackgroundManager();
