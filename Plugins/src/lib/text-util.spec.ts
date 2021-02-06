import { unifyNewLines } from './text-util';

describe('Text Util', () => {
    describe('unifyNewLines', () => {
        test('Replaces multiple instances of CRLF in a string', () => {
            const input = 'Testing\r\nTesting\r\n1...\r\n2...\r\n3...';
            const expected = 'Testing\nTesting\n1...\n2...\n3...';

            const result = unifyNewLines(input);
            expect(result).toEqual(expected);
        });
        test('Replaces multiple instances of CR in a string', () => {
            const input = 'Testing\rTesting\r1...\r2...\r3...';
            const expected = 'Testing\nTesting\n1...\n2...\n3...';

            const result = unifyNewLines(input);
            expect(result).toEqual(expected);
        });
        test('Correctly replaces mix of CR, CRLF and LF', () => {
            const input = 'Testing\rTesting\r\n1...\n2...\r\n3...';
            const expected = 'Testing\nTesting\n1...\n2...\n3...';

            const result = unifyNewLines(input);
            expect(result).toEqual(expected);
        });
    });
});
