import { green } from 'colors/safe';

const PROGRESS_BAR_LENGTH = 55;
const PROGRESS_BAR_FILL = '|';
const PROGRESS_BAR_EMPTY = '-';

const MOVE_CARET_UP = '\u001b[F';

const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export class StatusUpdatePrinter {
    private lastUpdateStringLength = 0;

    private pluginName: string;
    private status: string;
    private percentProgress?: number;

    private lastUpdateLines: number[];

    private spinnerPosition = 0;

    private interval: NodeJS.Timeout;

    public start(pluginName: string) {
        if (this.interval) {
            this.stopAndClear();
        }

        this.pluginName = pluginName;
        this.interval = setInterval(() => this.printCurrentStatus(), 50);
    }

    public stopAndClear() {
        clearInterval(this.interval);
        this.interval = undefined;
        this.status = undefined;
        this.percentProgress = undefined;
        this.pluginName = undefined;
        clear(this.lastUpdateLines);
    }

    public updateStatus(text: string) {
        this.status = text;
    }

    public updatePercentage(percent: number) {
        // force value to be a valid percentage
        percent = percent > 100 ? 100 : percent;
        percent = percent < 0 ? 0 : percent;

        this.percentProgress = percent;
    }

    public eraseOutput() {
        process.stderr.write(
            `\r${charLine(' ', this.lastUpdateStringLength)}\r`
        );
    }

    private printCurrentStatus() {
        const status =
            this.pluginName +
            (this.status ? `: ${this.status}` : '') +
            ` ${this.getSpinner()}`;
        const progress =
            this.percentProgress !== undefined
                ? buildProgressBar(this.percentProgress)
                : '';

        const toPrint = [status, progress];

        clear(this.lastUpdateLines);
        print(toPrint);
        this.lastUpdateLines = toPrint.map((line) => line.length);
    }

    private getSpinner(): string {
        this.spinnerPosition++;
        if (this.spinnerPosition >= spinner.length) {
            this.spinnerPosition = 0;
        }
        return spinner[this.spinnerPosition];
    }
}

function print(lines: string[]): void {
    for (let i = 0; i < lines.length; i++) {
        if (i !== 0) {
            process.stderr.write('\n');
        }
        const line = lines[i];
        process.stderr.write(line);
    }
}

function clear(lines: number[]): void {
    if (!lines) {
        return;
    }
    moveCaretUp(lines.length);
    print(lines.map((line) => charLine(' ', line)));
    moveCaretUp(lines.length);
}

function moveCaretUp(lines: number): void {
    for (let i = 0; i < lines / 2; i++) {
        process.stderr.write(MOVE_CARET_UP);
    }
}

function buildProgressBar(value: number): string {
    const filledBlocks = Math.trunc((value / 100) * PROGRESS_BAR_LENGTH);
    const emptyBlocks = PROGRESS_BAR_LENGTH - filledBlocks;

    return `[${green(charLine(PROGRESS_BAR_FILL, filledBlocks))}${charLine(
        PROGRESS_BAR_EMPTY,
        emptyBlocks
    )}] ${round(value)}%`;
}

// Generates a string containing a line of the specified character that is the specified length
function charLine(character: string, length: number): string {
    length = Math.trunc(length + 1);
    // NOTE: length +1 because 'join' uses the provided string as a separator to the array, so one fewer than the array length.
    // e.g. 0|1|2   - array is 3 length, but we only have 2 separators (|).
    return new Array(length).join(character);
}

// Rounds to max 2dp (only if required)
function round(num: number): number {
    return Math.round(num * 100) / 100;
}
