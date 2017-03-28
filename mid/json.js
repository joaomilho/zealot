const read = require('./internal/read');

const json = ({reviver, key = 'body'} = {}) => (result) =>
  result.chain((value) =>
    read(value, (body) => JSON.parse(body, reviver), key))

module.exports = json
