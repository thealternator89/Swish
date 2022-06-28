import unescapeBashNewlines from './bash-pwsh-interop';
import { basePluginArgument } from './lib/_test_util';

describe('Unescape Bash Newlines', () => {
    it('Converts escaped multiline string into a single line', async () => {
        const input = `Line 1 \\
        Line 2 \\
        Line 3 \\
        Line 4`;
        const expected = `Line 1 \`
        Line 2 \`
        Line 3 \`
        Line 4`;

        const output = await unescapeBashNewlines
            .find((plugin) => plugin.id === 'bash-to-powershell')
            .process({
                ...basePluginArgument,
                textContent: input,
            });

        expect(output).toEqual(expected);
    });
});
