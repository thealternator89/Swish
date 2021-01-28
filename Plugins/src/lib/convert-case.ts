// FROM: Kebab
export const convertKebabCaseToWordCase = (value: string) =>
    buildWordCase(value.split('-'));

// FROM: Pascal
export const convertPascalCaseToCamelCase = (value: string) =>
    buildCamelCase(splitCamelAndPascalCase(value));
export const convertPascalCaseToKebabCase = (value: string) =>
    buildKebabCase(splitCamelAndPascalCase(value));
export const convertPascalCaseToTitleCase = (value: string) =>
    buildTitleCase(splitCamelAndPascalCase(value));
export const convertPascalCaseToWordCase = (value: string) =>
    buildWordCase(splitCamelAndPascalCase(value));

// FROM: Camel
export const convertCamelCaseToPascalCase = (value: string) =>
    buildPascalCase(splitCamelAndPascalCase(value));
// In this context pascal and camel are the same
export const convertCamelCaseToTitleCase = convertPascalCaseToTitleCase;
export const convertCamelCaseToWordCase = convertPascalCaseToWordCase;

// FROM: Word
export const convertWordCaseToCamelCase = (value: string) =>
    buildCamelCase(value.split(' '));
export const convertWordCaseToConstantCase = (value: string) =>
    buildConstantCase(value.split(' '));
export const convertWordCaseToKebabCase = (value: string) =>
    buildKebabCase(value.split(' '));
export const convertWordCaseToPascalCase = (value: string) =>
    buildPascalCase(value.split(' '));
export const convertWordCaseToSnakeCase = (value: string) =>
    buildSnakeCase(value.split(' '));
export const convertWordCaseToTitleCase = (value: string) =>
    buildTitleCase(value.split(' '));

// Builders - takes a set of words and builds a string based on joining rules.
const buildCamelCase = (words: string[]) =>
    buildStringFromWords(words, capitalizeWord, '', lowerCaseFirstChar);
const buildConstantCase = (words: string[]) =>
    buildStringFromWords(words, upperCaseWord, '_');
const buildKebabCase = (words: string[]) =>
    buildStringFromWords(words, lowerCaseWord, '-');
const buildPascalCase = (words: string[]) =>
    buildStringFromWords(words, capitalizeWord, '');
const buildSnakeCase = (words: string[]) =>
    buildStringFromWords(words, lowerCaseWord, '_');
const buildTitleCase = (words: string[]) =>
    buildStringFromWords(words, capitalizeWord, ' ');
const buildWordCase = (words: string[]) =>
    buildStringFromWords(words, lowerCaseWord, ' ');

function buildStringFromWords(
    words: string[],
    wordConverter: (word: string) => string,
    joinChar: string,
    postProcess?: (text: string) => string
): string {
    const converted = words
        .map(wordConverter)
        .join(joinChar)
        .replace(new RegExp(`\\${joinChar}+`, 'g'), joinChar);

    if (postProcess) {
        return postProcess(converted);
    }

    return converted;
}

export function splitCamelAndPascalCase(value: string): string[] {
    // Split string on capital letter, unless the capital letter is both prefixed and postfixed with another capital letter.
    // Things to convert:
    //   * "findTvIpAddress" => ["find", "Tv", "Ip", "Address"]
    //   * "convertIPAddressToDNSAddress" => ["convert", "IP", "Address", "To", "DNS", "Address"]
    //   * "QueryParamToJSON" => ["Query", "Param", "To", "JSON"]
    // Things that won't work:
    //   * "convertPHPIPAddress" => ["convert", "PHP", "IP", "Address"] - multiple adjacent acronyms/initialisms. Would be a single word "PHPIP"
    //   * "downloadYouTubeVideo" => ["download", "YouTube", "Video"] - proprietary word "YouTube". this would be split into 2 words
    const words: string[] = [];

    let startOfCurrentWord = 0;

    for (let i = 0; i < value.length; i++) {
        if (
            i !== 0 && // is not the first char
            isUpperCase(value[i]) && // is upper case
            !(isUpperCase(value[i - 1]) && isUpperCase(value[i + 1])) // a char on either side of this char is not uppercase
        ) {
            words.push(
                value.substr(startOfCurrentWord, i - startOfCurrentWord)
            );
            startOfCurrentWord = i;
        }
    }

    words.push(value.substr(startOfCurrentWord));

    return words;
}

function isUpperCase(value: string): boolean {
    const A_CHAR_CODE = 65;
    const Z_CHAR_CODE = 90;

    for (let i = 0; i < value.length; i++) {
        const charCode = value.charCodeAt(i);

        if (charCode < A_CHAR_CODE || charCode > Z_CHAR_CODE) {
            return false;
        }
    }

    // Every char was in the uppercase char set, so unless the input string was empty it was uppercase.
    return value.length !== 0;
}

function capitalizeWord(word: string): string {
    return `${word[0].toUpperCase()}${word.substr(1)}`;
}

function lowerCaseFirstChar(text: string): string {
    return `${text[0].toLowerCase()}${text.substr(1)}`;
}

function lowerCaseWord(word: string): string {
    return word.toLowerCase();
}

function upperCaseWord(word: string): string {
    return word.toUpperCase();
}
