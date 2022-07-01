// Example 1: NO-OP
//
// This is the minimum required to write your own plugin!

module.exports = {
    name: 'NO-OP',
    process: async (args) => args.textContent,
};
