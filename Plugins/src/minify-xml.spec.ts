import minifyXml from './minify-xml';
import { basePluginArgument } from './lib/_test_util';

describe('Minify XML', () => {
    it('Minifies XML', async () => {
        const input = `
        <root>
            <parentElem>
                <child>Beep</child>
                <child>Is</child>
                <child>Cool</child>
            </parentElem>
        </root>`;
        const expected =
            '<root><parentElem><child>Beep</child><child>Is</child><child>Cool</child></parentElem></root>';

        const output = await minifyXml.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
    it('Handles emoji', async () => {
        const input = `
        <root>
            <parent emoji="💚">
                <frowny>🙁</frowny>
            </parent>
        </root>`;
        const expected =
            '<root><parent emoji="💚"><frowny>🙁</frowny></parent></root>';

        const output = await minifyXml.process({
            ...basePluginArgument,
            textContent: input,
        });

        expect(output).toEqual(expected);
    });
});
