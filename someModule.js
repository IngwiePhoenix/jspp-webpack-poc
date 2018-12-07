/**
 * @file
 * This file is included by WebPack, through a require()-call originating from
 * the compiled JS++ file.
 */

// We fall back to ES5 and `module.exports`-style exports.
// Why? Because we do not use babel here.

function add(a, b) {
  return a + b;
}

module.exports = add;

// ES6: export default add;
