import { ProvidedPluginArgument } from './model';

export = {
    name: 'Eval JS',
    description: `Evaluate the input as javascript`,
    id: 'eval-js',
    author: 'thealternator89',
    swishVersion: '2.0.0',
    icon: 'widgets',
    tags: ['evaluate', 'javascript', 'execute', 'run'],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: 'javascript'},
    process: async (args: ProvidedPluginArgument) => {
        const text = args.textContent;
        let js: string;

        if (text.trim().length === 0) {
            throw new Error('No input provided');
        }

        if (text.indexOf('return') !== -1) {
            js = `(()=>{${text}})()`;
        } else {
            js = `(${text})`;
        }

        return evalAndFormatResult(js);
    },
};

function evalAndFormatResult(jsToEval: string): string {
    const result = eval(jsToEval);
    return formatResult(result);
}

function formatResult(input: any): string {
    if (input === undefined) {
        return 'undefined';
    } else if (input === null) {
        return 'null';
    } else if (typeof input === 'object') {
        return JSON.stringify(input, null, 4);
    } else {
        return input.toString();
    }
}
