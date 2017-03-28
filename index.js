const http = require('http')
const {on, stream} = require('flyd')
const Result = require('folktale/data/result')
const ok = require('./ok')

const listen = (port, msg = `Listening to ${port}...`) => {
  const $ = stream()

  http
    .createServer((req, res) => $(Result.of({ req, res, mid: {} })))
    .listen(port, () => console.log(msg))

  return $
};

module.exports = {listen, on, ok};
