import { ProvidedPluginArgument } from './model';

export = [
    {
        source: 'Bash',
        target: 'PowerShell',
        inputRegex: /(\\\n)/g,
        replacement: '`\n',
    },
    {
        source: 'PowerShell',
        target: 'Bash',
        inputRegex: /(`\n)/g,
        replacement: '\\\n',
    },
].map(({ source, target, inputRegex, replacement }) => ({
    name: `Convert ${source} escaped newlines for ${target}`,
    description: `Make a ${source} command work in ${target}`,
    id: `${source}-to-${target}`.toLowerCase(),
    author: 'thealternator89',
    swishVersion: '1.3.0',
    icon: 'attach_money',
    tags: ['shell', 'dev', source.toLowerCase(), target.toLowerCase()],
    group: 'Dev',
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) =>
        args.textContent.replace(inputRegex, replacement),
}));
