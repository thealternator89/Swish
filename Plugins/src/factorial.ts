import { ProvidedPluginArgument } from './model';

export = {
    name: 'Factorial',
    description: 'Calculates the factorial value of the number provided',
    id: 'factorial',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'calculate',
    usableFrom: ['core', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        const text = args.textContent.trim();
        const parsed = parseInt(text);
        if (`${parsed}` !== text) {
            throw new Error(`Value '${text}' is not a number`);
        }

        // If we start above 21, integer overflow will occur.
        if (parsed > 21) {
            throw new Error(
                `Can't perform factorial on ${parsed}. Max starting value is 21`
            );
        }

        // Negative factorials are valid, but this would be slightly difficult to support
        if (parsed < 0) {
            throw new Error(`Negative values not supported`);
        }

        if (parsed > 1) {
            const next = await args.runPlugin('factorial', {
                ...args,
                textContent: `${parsed - 1}`,
            });
            const nextInt = parseInt(next);
            return `${parsed * nextInt}`;
        }

        return '1';
    },
};
