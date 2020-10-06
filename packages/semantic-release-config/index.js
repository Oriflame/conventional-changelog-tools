// This is ugly, but we can't use `export =` and named exports
// within TypeScript, so we need to fake it here so our types
// resolve correctly in consumers.

const config = require('./lib');

module.exports = config.default;
