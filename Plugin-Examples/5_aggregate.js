// Example 5: Aggregate
//
// This plugin doesn't do anything itself - it just runs other plugins.
// Swish will pass your input to the first plugin, then chain the output of each plugin on to the next plugin in the array.
//
// The below plugin will pass your input to the `yaml-to-json` plugin, and then pass the result to the `minify-json` plugin and give you the result.
// You can keep going, add as many different steps onto the process as you need!

module.exports = {
    name: 'Aggregate',
    description:
        'Build a plugin based on running a set of other plugins. This one converts YAML to minified JSON.',
    id: 'aggregate',
    author: 'thealternator89',
    swishVersion: '1.6.0', // Aggregate plugins were added in v1.6.0
    tags: ['aggregate', 'plugins', 'run'],
    icon: 'keyboard_double_arrow_right',
    type: 'aggregate', // <- This tells Swish that this is an 'aggregate' plugin, rather than a standard plugin
    plugins: ['yaml-to-json', 'minify-json'], // <- This tells Swish which plugins to run.
};
