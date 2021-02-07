import { NEWLINE_CHAR, unifyNewLines } from './lib/text-util';
import { ProvidedPluginArgument } from './model';

// Valid comma groupings
// Either: - (\d*|\d{1,3}(,\d{3})*)
//  * Any number of digits - \d* - or
//  * 1-3 digits, followed by any number of groups of 3 digits - \d{1,3}(,\d{3})*
// Possibly followed by a . and any number of digits - (\.\d*)?
const VALID_NUMBER = /^(\d*|\d{1,3}(,\d{3})*)(\.\d*)?$/;

export = {
    name: 'Sort Lines (Natural)',
    description: 'Sorts the lines of the input, keeping numbers in order',
    id: 'sort-lines',
    author: 'thealternator89',
    beepVersion: '1.0.0',
    icon: 'sort',
    process: async (args: ProvidedPluginArgument) => {
        return unifyNewLines(args.textContent)
            .split(NEWLINE_CHAR)
            .sort(naturalCompare)
            .join(NEWLINE_CHAR);
    },
};

function naturalCompare(stringA: string, stringB: string): number {
    const wordsA = stringA.split(' ');
    const wordsB = stringB.split(' ');

    // Get the shortest sentence
    const maxWords =
        wordsA.length < wordsB.length ? wordsA.length : wordsB.length;

    for (let i = 0; i < maxWords; i++) {
        const wordA = wordsA[i];
        const wordB = wordsB[i];

        if (wordA === wordB) {
            continue;
        }

        const wordAIsNumber = isNumber(wordA);
        const wordBIsNumber = isNumber(wordB);

        if (wordAIsNumber && wordBIsNumber) {
            return compareNumberWords(wordA, wordB);
        }

        // If one is a number and one isn't sort the number first
        if (wordAIsNumber || wordBIsNumber) {
            return wordAIsNumber ? -1 : 1;
        }

        return wordA.localeCompare(wordB);
    }

    return stringA.localeCompare(stringB);
}

function isNumber(word: string): boolean {
    return VALID_NUMBER.test(word);
}

function compareNumberWords(wordA: string, wordB: string) {
    // We've tested that both 'words' are numbers, possibly with commas.
    // The regex checked that the commas are in the correct place, so we can strip them before comparing the numbers.
    const removedCommasA = wordA.replace(/,/g, '');
    const removedCommasB = wordB.replace(/,/g, '');

    return Number(removedCommasA) - Number(removedCommasB);
}
