/**
 * Limited Stack
 * Used to allow us to keep an in-memory logger with a limited length.
 */
export class LimitedStack<T> {
    private stack: T[];

    constructor(private maxSize: number) {
        this.stack = [];
    }

    /**
     * Push an item into the list, removing any items to ensure the stack stays below the maximum length
     * @param item Item to add
     */
    push(item: T): void {
        this.makeSpace();
        this.stack.push(item);
    }

    /**
     * Clear the stack
     */
    clear(): void {
        this.stack = [];
    }

    /**
     * Calculate the size of the stack
     * @returns The number of items in the stack
     */
    size(): number {
        return this.stack.length;
    }

    /**
     * Gets a copy of the items in the stack.
     * NOTE this will drop all functionality from the items in the stack
     * @returns A copy of the items in the list.
     */
    toList(): T[] {
        return JSON.parse(JSON.stringify(this.stack));
    }

     /**
      * Makes space in the stack, ensuring that there is one spot left in the stack.
      */
     private makeSpace(): void {
        while(this.isFull()) {
            this.stack.shift();
        }
     }

     /**
      * Check if the stack is full.
      * If the max size is defined (> 0) the stack is full if there are more than the maxSize items in it.
      * If the max size is <= 0, the stack acts as a regular (non-limited) stack which is never full.
      * @returns True if the stack is full
      */
     private isFull(): boolean {
        return this.maxSize > 0 && this.stack.length >= this.maxSize;
     }

}
