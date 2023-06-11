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
    buildCamelCase(sanitize(value).split(' '));
export const convertWordCaseToConstantCase = (value: string) =>
    buildConstantCase(sanitize(value).split(' '));
export const convertWordCaseToKebabCase = (value: string) =>
    buildKebabCase(sanitize(value).split(' '));
export const convertWordCaseToPascalCase = (value: string) =>
    buildPascalCase(sanitize(value).split(' '));
export const convertWordCaseToSnakeCase = (value: string) =>
    buildSnakeCase(sanitize(value).split(' '));
export const convertWordCaseToTitleCase = (value: string) =>
    buildTitleCase(sanitize(value).split(' '));

// Builders - takes a set of words and builds a string based on joining rules.
export const buildCamelCase = (words: string[]) =>
    buildStringFromWords(words, capitalizeWord, '', lowerCaseFirstChar);
export const buildConstantCase = (words: string[]) =>
    buildStringFromWords(words, upperCaseWord, '_');
export const buildKebabCase = (words: string[]) =>
    buildStringFromWords(words, lowerCaseWord, '-');
export const buildPascalCase = (words: string[]) =>
    buildStringFromWords(words, capitalizeWord, '');
export const buildSnakeCase = (words: string[]) =>
    buildStringFromWords(words, lowerCaseWord, '_');
export const buildTitleCase = (words: string[]) =>
    buildStringFromWords(words, capitalizeWord, ' ');
export const buildWordCase = (words: string[]) =>
    buildStringFromWords(words, lowerCaseWord, ' ', upperCaseFirstChar);

export function splitCamelAndPascalCase(value: string): string[] {
    // Split string on capital letter, unless the capital letter is both prefixed and postfixed with another capital letter.
    // Things to convert:
    //   * "findTvIpAddress" => ["find", "Tv", "Ip", "Address"]
    //   * "convertIPAddressToDNSAddress" => ["convert", "IP", "Address", "To", "DNS", "Address"]
    //   * "QueryParamToJSON" => ["Query", "Param", "To", "JSON"]
    // Things that won't work:
    //   * "convertPHPIPAddress" => ["convert", "PHP", "IP", "Address"] - multiple adjacent acronyms/initialisms. Would be a single word "PHPIP"
    //   * "downloadYouTubeVideo" => ["download", "YouTube", "Video"] - proprietary word "YouTube". this would be split into 2 words

    const isStartOfNewWord = (index: number): boolean =>
        index !== 0 &&
        value[index] !== value[index].toLowerCase() &&
        value[index - 1] !== value[index - 1].toUpperCase();

    const words: string[] = [];

    let startOfCurrentWord = 0;

    for (let i = 0; i < value.length; i++) {
        if (isStartOfNewWord(i)) {
            words.push(
                value.substring(startOfCurrentWord, i)
            );
            startOfCurrentWord = i;
        }
    }

    words.push(value.substring(startOfCurrentWord));

    return words;
}

/**
 * Builds a string by converting an array of words, joining them using a specified character,
 * and optionally performing a post-processing step on the final string.
 *
 * @param words - The array of words to convert and join.
 * @param wordConverter - A function that converts individual words.
 * @param joinChar - The character used to join the converted words.
 * @param postProcess - An optional function to perform post-processing on the final string.
 * @returns The built string.
 */
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

// Check if a string is all uppercase.
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

// Capitalize the first letter of a word, and lowercase the rest while keeping acronyms/initialisms uppercase.
function capitalizeWord(word: string): string {
    if (word.length === 0) {
        return '';
    }

    const firstChar = word[0];
    const restOfWord = word.substring(1);

    return firstChar + (isUpperCase(restOfWord) ? restOfWord : restOfWord.toLowerCase());
}

// Capitalize the first letter and leave the rest of the word as is.
function upperCaseFirstChar(text: string): string {
    return text.length > 0 ? `${text[0].toUpperCase()}${text.substring(1)}` : '';
}

// Lowercase the first letter and leave the rest of the word as is.
function lowerCaseFirstChar(text: string): string {
    return text.length > 0 ? `${text[0].toLowerCase()}${text.substring(1)}` : '';
}

// Lowercase the entire word.
function lowerCaseWord(word: string): string {
    return word.toLowerCase();
}

// Uppercase the entire word.
function upperCaseWord(word: string): string {
    return word.toUpperCase();
}

// Remove all non-alphanumeric characters from the string.
function sanitize(value: string): string {
    return value.trim().replace(/[^\w\s]/gi, '');
}
