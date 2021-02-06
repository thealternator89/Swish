import {
    convertPascalCaseToKebabCase,
    convertWordCaseToCamelCase,
    convertWordCaseToKebabCase,
    splitCamelAndPascalCase,
} from './convert-case';

describe('Convert Case', () => {
    describe('Word case to camel case', () => {
        it('Converts word case to camel case', () => {
            const input = 'camel case';
            const expected = 'camelCase';

            const output = convertWordCaseToCamelCase(input);
            expect(output).toEqual(expected);
        });
    });
    describe('Word case to kebab case', () => {
        it('Converts word case to kebab case', () => {
            const input = 'kebab case';
            const expected = 'kebab-case';

            const output = convertWordCaseToKebabCase(input);
            expect(output).toEqual(expected);
        });
    });
    describe('Pascal case to kebab case', () => {
        it('Converts pascal case to kebab case', () => {
            const input = 'PascalCaseString';
            const expected = 'pascal-case-string';

            const output = convertPascalCaseToKebabCase(input);
            expect(output).toEqual(expected);
        });
        it('Converts string containing acronyms to kebab case', () => {
            const input = 'convertIPAddressToDNSAddress';
            const expected = 'convert-ip-address-to-dns-address';

            const output = convertPascalCaseToKebabCase(input);
            expect(output).toEqual(expected);
        });
    });
});
describe('Split Pascal and Camel case', () => {
    it('Splits basic camel case correctly', () => {
        const input = 'aBasicCamelCaseString';
        const expected = ['a', 'Basic', 'Camel', 'Case', 'String'];

        const output = splitCamelAndPascalCase(input);
        expect(output).toEqual(expected);
    });
    it('Splits basic pascal case correctly', () => {
        const input = 'ABasicPascalCaseString';
        const expected = ['A', 'Basic', 'Pascal', 'Case', 'String'];

        const output = splitCamelAndPascalCase(input);
        expect(output).toEqual(expected);
    });
    it('Splits acronyms/initialisms correctly', () => {
        const input = 'convertIPAddressToDNSAddress';
        const expected = ['convert', 'IP', 'Address', 'To', 'DNS', 'Address'];

        const output = splitCamelAndPascalCase(input);
        expect(output).toEqual(expected);
    });
});
