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
    name: `${source} to ${target}`,
    description: `Make a ${source} command work in ${target}`,
    id: `${source}-to-${target}`.toLowerCase(),
    author: 'thealternator89',
    swishVersion: '1.3.0',
    icon: 'attach_money',
    tags: ['shell', 'dev', source.toLowerCase(), target.toLowerCase()],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: source.toLowerCase() },
    process: async (args: ProvidedPluginArgument) => ({
        text: args.textContent.replace(inputRegex, replacement),
        render: 'text',
        syntax: target.toLowerCase(),
    }),
}));
