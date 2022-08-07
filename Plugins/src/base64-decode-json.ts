export = {
    name: 'Base-64 Decode JSON',
    description: 'Decode a Base-64 encoded string and format as JSON',
    id: 'base64-decode-json',
    author: 'thealternator89',
    tags: ['base64', 'decode', 'json'],
    swishVersion: '1.6.0',
    icon: 'code',
    usableFrom: ['core', 'clip', 'gui'],
    type: 'aggregate',
    plugins: ['base64-decode', 'prettify-json'],
};
