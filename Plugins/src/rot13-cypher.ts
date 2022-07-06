import { ProvidedPluginArgument } from './model';

const LOWER_A = 97;
const LOWER_Z = 122;

const UPPER_A = 65;
const UPPER_Z = 90;

export = {
    name: 'ROT13 cypher',
    description:
        'Basic, insecure cypher. Rotates each alphabet character by 13 places',
    id: 'rot13-cypher',
    author: 'thealternator89',
    swishVersion: '1.0.0',
    icon: 'lock_open',
    tags: ['rot13', 'crypto'],
    usableFrom: ['core', 'clip', 'gui'],
    process: async (args: ProvidedPluginArgument) => {
        return args.textContent.split('').map(rotate13).join('');
    },
};

function rotate13(character: string): string {
    const code = character.charCodeAt(0);

    // Character code is not in the alphabet range, so ignore it
    if (
        code < UPPER_A ||
        (code > UPPER_Z && code < LOWER_A) ||
        code > LOWER_Z
    ) {
        return character;
    }

    let newCode = code + 13;

    if (code <= UPPER_Z && newCode > UPPER_Z) {
        newCode = newCode - UPPER_Z + (UPPER_A - 1);
    } else if (newCode > LOWER_Z) {
        newCode = newCode - LOWER_Z + (LOWER_A - 1);
    }

    return String.fromCharCode(newCode);
}
