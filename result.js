const {curry} = require('ramda')

const sendWith = curry((fn, context) =>
  context.res.end(fn(context)))

const send = curry((text, {res}) =>
  res.end(text))

const sendJSONWith = curry((fn, context) => {
  context.res.end(JSON.stringify(fn(context)))
})

const sendJSON = curry((json, {res}) =>
  res.end(JSON.stringify(json)))

module.exports = { send, sendJSON, sendWith, sendJSONWith }
