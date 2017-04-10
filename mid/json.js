const read = require('./internal/read');
const flatMap = require('flyd/module/flatMap');
const {chain} = require('ramda');

const json = ({reviver, key = 'body'} = {}) => flatMap(chain(
  read((body) => JSON.parse(body, reviver), key)))

module.exports = json
