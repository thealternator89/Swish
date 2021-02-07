import sortLines from './sort-lines';
import { basePluginArgument } from './lib/_test_util';
import { NEWLINE_CHAR } from './lib/text-util';

describe('Sort Lines', () => {
    it('Sorts the input lines', async () => {
        const inputLines = ['Zero', 'Alfa', 'Hotel'];
        const expectedLines = ['Alfa', 'Hotel', 'Zero'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles CRLF line endings', async () => {
        const inputLines = ['Golf', 'Sierra', 'Charlie'];
        const expectedLines = ['Charlie', 'Golf', 'Sierra'];

        const input = inputLines.join('\r\n');
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
