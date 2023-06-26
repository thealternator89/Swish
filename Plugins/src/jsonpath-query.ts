import { JSONPath } from "jsonpath-plus";

export = {
    name: 'Evaluate JSONPath',
    id: 'jsonpath-query',
    description: 'Query JSON object using JSONPath',
    author: 'thealternator89',
    tags: ['json', 'query'],
    icon: 'data_object',
    swishVersion: '2.0.0',
    input: {
        type: 'form',
        fields: [
            {
                key: 'jsonpath',
                label: 'JSONPath',
                type: 'text',
                placeholder: 'e.g. $.store.book[*].author',
            }
        ],
        includeEditor: true,
        editorPosition: 'bottom',
    },
    process: async (args) => {
        const { jsonpath: path } = args.formContent;
        const json = JSON.parse(args.textContent);
        const result = JSONPath({ path, json });

        return {
            text: JSON.stringify(result, null, 4),
            syntax: 'json'
        }
    }
}
