// Example 4: Factorial
//
// This plugin recursively runs itself to reach a result.
// NOTE: This isn't a good or useful implementation, this is just an example to show how to build a recursive plugin.

module.exports = {
    name: 'Factorial',
    description: 'Calculates the factorial value of the number provided',
    id: 'factorial',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    tags: ['factorial', 'math', 'calculation'],
    icon: 'calculate',
    process: async (args) => {
        const text = args.textContent.trim();
        const parsed = BigInt(text);
        if (`${parsed}` !== text) {
            throw new Error(`Value '${text}' is not a number`);
        }

        // Negative factorials are valid, but this would be slightly difficult to support
        if (parsed < 0) {
            throw new Error(`Negative values not supported`);
        }

        if (parsed > 1) {
            const next = await args.runPlugin('factorial', {
                ...args,
                textContent: `${parsed - 1n}`,
            });
            const nextInt = BigInt(next);
            return `${parsed * nextInt}`;
        }

        return '1';
    },
};
