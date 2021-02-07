import reverseLines from './reverse-lines';
import { basePluginArgument } from './lib/_test_util';

describe('Reverse Lines', () => {
    it('Reverses the input lines', async () => {
        const inputLines = ['Line 1', 'Line 2', 'Line 3'];
        const expectedLines = ['Line 3', 'Line 2', 'Line 1'];

        const input = inputLines.join('\n');
        const expected = expectedLines.join('\n');

        const output = await reverseLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles CRLF line endings', async () => {
        const inputLines = ['Line 1', 'Line 2', 'Line 3'];
        const expectedLines = ['Line 3', 'Line 2', 'Line 1'];

        const input = inputLines.join('\r\n');
        const expected = expectedLines.join('\n');

        const output = await reverseLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
