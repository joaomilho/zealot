const r = require('./result')

const mapToStream = (fn) => (input) => (result) => result.map(fn(input))

module.exports = {
  send: mapToStream(r.send),
  sendJSON: mapToStream(r.sendJSON),
  sendWith: mapToStream(r.sendWith),
  sendJSONWith: mapToStream(r.sendJSONWith)
}
