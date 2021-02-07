import dedupLines from './dedup-lines-content';
import { NEWLINE_CHAR } from './lib/text-util';
import { basePluginArgument } from './lib/_test_util';

describe('Deduplicate Lines (content)', () => {
    it('Deduplicates lines', async () => {
        const inputLines = ['Line 1', 'Line 2', 'Line 1', 'Line 3'];

        const expectedLines = ['Line 1', 'Line 2', 'Line 3'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await dedupLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Ignores whitespace when deduplicating', async () => {
        const inputLines = ['Line 1     ', 'Line 2', '     Line 1', 'Line 3'];

        const expectedLines = ['Line 1     ', 'Line 2', 'Line 3'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await dedupLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Ignores capitalization when deduplicating', async () => {
        const inputLines = ['LInE 1', 'Line 2', 'line 1', 'Line 3'];

        const expectedLines = ['LInE 1', 'Line 2', 'Line 3'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await dedupLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(expected);
    });
    it('Returns info if no duplicate lines were found', async () => {
        const inputLines = ['Line 1', 'Line 2', 'Line 3'];

        const input = inputLines.join(NEWLINE_CHAR);

        const output = await dedupLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output.text).toEqual(input);
        expect(output.message.text).toEqual('No duplicate lines found');
    });
});
