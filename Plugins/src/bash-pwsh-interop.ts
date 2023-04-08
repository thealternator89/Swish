import { ProvidedPluginArgument } from './model';

export = [
    {
        source: 'Bash',
        target: 'PowerShell',
        inputRegex: /(\\\n)/g,
        replacement: '`\n',
        sourceSyntax: 'shell',
        targetSyntax: 'powershell',
    },
    {
        source: 'PowerShell',
        target: 'Bash',
        inputRegex: /(`\n)/g,
        replacement: '\\\n',
        sourceSyntax: 'powershell',
        targetSyntax: 'shell',
    },
].map(({ source, target, inputRegex, replacement, sourceSyntax, targetSyntax }) => ({
    name: `${source} to ${target}`,
    description: `Make a ${source} command work in ${target}`,
    id: `${source}-to-${target}`.toLowerCase(),
    author: 'thealternator89',
    swishVersion: '1.3.0',
    icon: 'attach_money',
    tags: ['shell', 'dev', source.toLowerCase(), target.toLowerCase()],
    usableFrom: ['core', 'clip', 'gui'],
    input: { syntax: sourceSyntax },
    process: async (args: ProvidedPluginArgument) => ({
        text: args.textContent.replace(inputRegex, replacement),
        render: 'text',
        syntax: targetSyntax,
    }),
}));
