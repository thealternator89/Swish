import { ProvidedPluginArgument } from './lib/plugin-definition';

export = {
    name: 'Eval JS',
    description: `Evaluate the input as javascript`,
    id: 'eval-js',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    process: async (args: ProvidedPluginArgument) => {
        const text = args.textContent;
        let js: string;

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
        return JSON.stringify(input);
    } else {
        return input.toString();
    }
}
