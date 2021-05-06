import { identifyLineEndingChar, unifyLineEndings } from './text-utils';

describe('identifyLineEndingChar', () => {
    describe('default', () => {
        it('defaults to "\\n" line endings when no line endings are found', () => {
            const char = identifyLineEndingChar('single line of text');
            expect(char).toEqual('\n');
        });
    });
    describe('single line ending type', () => {
        it('returns "\\n" when text only contains LF line endings', () => {
            const char = identifyLineEndingChar('multi\nline\nstring');
            expect(char).toEqual('\n');
        });
        it('returns "\\r\\n" when text only contains CRLF line endings', () => {
            const char = identifyLineEndingChar('multi\r\nline\r\nstring');
            expect(char).toEqual('\r\n');
        });
        it('returns "\\r" when text only contains CR line endings', () => {
            const char = identifyLineEndingChar('multi\rline\rstring');
            expect(char).toEqual('\r');
        });
    });
    describe('multi line ending types', () => {
        it('returns "\\n" when most common line endings', () => {
            const char = identifyLineEndingChar('\rmulti\nline\nstring\r\n');
            expect(char).toEqual('\n');
        });
        it('returns "\\r\\n" when most common line endings', () => {
            const char = identifyLineEndingChar('\rmulti\r\nline\nstring\r\n');
            expect(char).toEqual('\r\n');
        });
        it('returns "\\r" when most common line endings', () => {
            const char = identifyLineEndingChar('\rmulti\rline\nstring\r\n');
            expect(char).toEqual('\r');
        });
    });
    describe('no prevalent ending type', () => {
        it('returns LF when equal count with CR', () => {
            const char = identifyLineEndingChar('\rmulti\nline\nstring\r');
            expect(char).toEqual('\n');
        });
        it('returns CRLF when equal count with CR', () => {
            const char = identifyLineEndingChar('\nmulti\r\nline\nstring\r\n');
            expect(char).toEqual('\r\n');
        });
        it('returns CRLF when equal count with LF', () => {
            const char = identifyLineEndingChar('\rmulti\r\nline\rstring\r\n');
            expect(char).toEqual('\r\n');
        });
    });
});

describe('unifyLineEndings', () => {
    describe('defaults to LF line endings', () => {
        it('CRLF converts to LF', () => {
            const unified = unifyLineEndings(
                'multi\r\nline\r\nstring\r\nwith\r\nCRLF\r\nendings'
            );
            expect(unified).toEqual('multi\nline\nstring\nwith\nCRLF\nendings');
        });
        it('CR converts to LF', () => {
            const unified = unifyLineEndings(
                'multi\rline\rstring\rwith\rCR\rendings'
            );
            expect(unified).toEqual('multi\nline\nstring\nwith\nCR\nendings');
        });
        it('converts a mix of CRLF, CR and LF line endings to LF', () => {
            const unified = unifyLineEndings(
                'multi\r\nline\rstring\nwith\r\nmix\rof\nline\r\nendings'
            );
            expect(unified).toEqual(
                'multi\nline\nstring\nwith\nmix\nof\nline\nendings'
            );
        });
    });
    describe('adheres to provided line ending', () => {
        it('uses CRLF endings if "\\r\\n" passed as second argument', () => {
            const unified = unifyLineEndings(
                'multi\nline\nstring\nwith\nLF\nendings',
                '\r\n'
            );
            expect(unified).toEqual(
                'multi\r\nline\r\nstring\r\nwith\r\nLF\r\nendings'
            );
        });
        it('uses CR endings if "\\r" passed as second argument', () => {
            const unified = unifyLineEndings(
                'multi\nline\nstring\nwith\nLF\nendings',
                '\r'
            );
            expect(unified).toEqual('multi\rline\rstring\rwith\rLF\rendings');
        });
    });
});
