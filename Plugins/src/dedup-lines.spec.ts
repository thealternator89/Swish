import dedupLines from './dedup-lines';
import { NEWLINE_CHAR } from './lib/text-util';
import { basePluginArgument } from './lib/_test_util';

describe('Deduplicate Lines', () => {
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
