const always = require('ramda/src/always')
const pipe = require('ramda/src/pipe')

const sendWith = (fn) => (value) =>
  value.res.end(fn(value))

const send = pipe(always, sendWith)

const sendJSONWith = (fn) => (value) => {
  value.res.end(JSON.stringify(fn(value)))
}

const sendJSON = pipe(always, sendJSONWith)

module.exports = { send, sendJSON, sendWith, sendJSONWith }
