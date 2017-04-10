'use strict';

const bytes = require('bytes');
const contentType = require('content-type');
const read = require('./parseBody');
const typeis = require('type-is');
const of = require('most').of;
const identity = require('ramda/src/identity');
const flip = require('ramda/src/flip');
const T = require('ramda/src/T');

module.exports = text;

/**
 * Create a middleware to parse text bodies.
 *
 * @param {object} [options]
 * @return {function}
 * @api public
 */
const defaults = {
  defaultCharset: 'utf-8',
  type: 'text/plain',
  verify: T,
};

function text({ defaultCharset, inflate, limit, type, verify } = defaults) {
  limit = typeof limit !== 'number' ? bytes.parse(limit || '100kb') : limit;

  // create the appropriate type checking function
  var shouldParse = typeof type !== 'function' ? flip(typeis)(type) : type;

  return function textParser({ req, res, middleware }) {
    if (middleware.body || !typeis.hasBody(req) || !shouldParse(req)) {
      return of({ req, res, middleware });
    }

    // get charset
    const encoding = getCharset(req) || defaultCharset;

    // read
    return read(req, res, middleware, identity, {
      encoding,
      inflate,
      limit,
      verify,
    });
  };
}

/**
 * Get the charset of a request.
 *
 * @param {object} req
 * @api private
 */

function getCharset(req) {
  try {
    return contentType.parse(req).parameters.charset.toLowerCase();
  } catch (e) {
    return undefined;
  }
}
