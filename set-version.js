const { readFileSync, writeFileSync } = require('fs');
const { platform } = require('os');
const { exec } = require('child_process');
const path = require('path');

const VERSION_REGEX = /^\d+\.\d+\.\d+(-.*?)?$/;

// take the first arg (argv[0] is 'node', argv[1] is 'set-version.js', argv[2] is the first **actual** arg)
const version = process.argv[2];

if (!VERSION_REGEX.test(version)) {
    console.error(`Invalid version number: ${version}`);
    return;
}

// Packages
// NOTE the order is important!
const packageJsonLocations = [
    '.',
    'Plugins',
    'Base',
    'Clip',
    'Core',
    'Gui',
    'Gui-v2',
    'Web/web',
    'Web',
];

for (const location of packageJsonLocations) {
    const directory = path.join(__dirname, location);
    const packageFile = path.join(directory, 'package.json');

    const parsed = JSON.parse(readFileSync(packageFile));
    parsed.version = version;
    const serialized = serialize(parsed);

    writeFileSync(packageFile, serialized);

    // Run NPM install to update Package-Lock
    exec(`cd ${directory} && npm i`, (_error, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
    });

    console.log(`Version in ${packageFile} set to ${version}`);
}

// -----------

function serialize(obj) {
    const serialized = JSON.stringify(obj, undefined, '  ') + '\n';

    // On Windows use CRLF rather than LF for line endings.
    if (platform() === 'win32') {
        return serialized.replace(/\n/g, '\r\n');
    }
    return serialized;
}
