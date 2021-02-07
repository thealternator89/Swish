import sortLines from './sort-lines-natural';
import { basePluginArgument } from './lib/_test_util';
import { NEWLINE_CHAR } from './lib/text-util';

describe('Sort Lines', () => {
    it('Sorts the input lines', async () => {
        const inputLines = ['53', '17', '23.5'];
        const expectedLines = ['17', '23.5', '53'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles strings which start with the same word(s)', async () => {
        const inputLines = [
            'Foxtrot 7',
            'Golf Xray 23 Hotel',
            'Golf Xray 57 Charlie',
            'Golf Xray 9 Alfa',
        ];
        const expectedLines = [
            'Foxtrot 7',
            'Golf Xray 9 Alfa',
            'Golf Xray 23 Hotel',
            'Golf Xray 57 Charlie',
        ];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles commas in numbers', async () => {
        const inputLines = ['170', '10,037', '53', '730'];
        const expectedLines = ['53', '170', '730', '10,037'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles decimal points in numbers', async () => {
        const inputLines = ['13.03', '13.129', '14.00', '13'];
        const expectedLines = ['13', '13.03', '13.129', '14.00'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Sorts numbers above words starting with numbers', async () => {
        const inputLines = ['1', '2', '1word', '17'];
        const expectedLines = ['1', '2', '17', '1word'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Sorts numbers with invalid commas as words', async () => {
        const inputLines = ['1,000', '2,100', '1,33,25', '17.00'];
        const expectedLines = ['17.00', '1,000', '2,100', '1,33,25'];

        const input = inputLines.join(NEWLINE_CHAR);
        const expected = expectedLines.join(NEWLINE_CHAR);

        const output = await sortLines.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
