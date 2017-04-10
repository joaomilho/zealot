const r = require('./result')

const mapErrorToStream = (fn) => (input) => (result) => result.mapError(fn(input))

module.exports = {
  send: mapErrorToStream(r.send),
  sendJSON: mapErrorToStream(r.sendJSON),
  sendWith: mapErrorToStream(r.sendWith),
  sendJSONWith: mapErrorToStream(r.sendJSONWith)
}
