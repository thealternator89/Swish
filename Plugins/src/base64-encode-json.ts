export = {
    name: 'Base-64 Encode JSON',
    description: 'Minify and encode JSON as a Base-64 encoded string',
    id: 'base64-encode-json',
    author: 'thealternator89',
    tags: ['base64', 'encode', 'json'],
    swishVersion: '1.6.0',
    icon: 'code',
    usableFrom: ['core', 'clip', 'gui'],
    type: 'aggregate',
    plugins: ['minify-json', 'base64-encode'],
};
