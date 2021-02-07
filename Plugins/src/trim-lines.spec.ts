import trimLines from './trim-lines';
import { basePluginArgument } from './lib/_test_util';
import { NEWLINE_CHAR } from './lib/text-util';

describe('Trim Lines', () => {
    it('Trims the text on all lines', async () => {
        const inputLines = ['Line 1  ', '        Line 2', '   Line 3   '];
        const expectedLines = ['Line 1', 'Line 2', 'Line 3'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await trimLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
