import rot13 from './rot13-cypher';
import { basePluginArgument } from './lib/_test_util';

describe('ROT13 Cypher', () => {
    it('Correctly rotates alphabetical characters by 13 places', async () => {
        const input = 'Test String';
        const expected = 'Grfg Fgevat';

        const output = await rot13.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Only rotates alphabetical characters while retaining others', async () => {
        const input = 'Test String! 123 💛💚❤️';
        const expected = 'Grfg Fgevat! 123 💛💚❤️';

        const output = await rot13.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Running ROT13 twice reisntates the original text', async () => {
        const input = 'Test String! 123';

        const first = await rot13.process({
            ...basePluginArgument,
            textContent: input,
        });

        const second = await rot13.process({
            ...basePluginArgument,
            textContent: first,
        });

        expect(second).toEqual(input);
    });
});
