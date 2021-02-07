import padRight from './pad-right';
import { basePluginArgument } from './lib/_test_util';
import { NEWLINE_CHAR } from './lib/text-util';

describe('Pad Right', () => {
    it('Makes all lines the same length, with padding to the right', async () => {
        const inputLines = ['a', 'boo', 'test data', 'ok'];

        const expectedLines = [
            'a        ',
            'boo      ',
            'test data',
            'ok       ',
        ];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await padRight.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Strips existing trailing/leading whitespace before padding', async () => {
        const inputLines = [
            'a        ',
            '       boo',
            'test data       ',
            'ok      ',
        ];

        const expectedLines = [
            'a        ',
            'boo      ',
            'test data',
            'ok       ',
        ];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await padRight.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
