const getBody = require('raw-body')
const merge = require('ramda/src/merge')
const { stream } = require('flyd')
const Result = require('folktale/data/result')

const hasBody = (req) =>
  req.headers['transfer-encoding'] !== undefined ||
    !isNaN(req.headers['content-length'])

const read = ({req, res, mid}, parse, key) => {
  const $ = stream()

  if (!hasBody(req)) {
    return $(Result.Error({ req, res, mid }))
  }

  getBody(req, (error, body) => {
    if (error) {
      setErrStatus(error, 400)

      return $(Result.Error({req, res, error}))
    }

    try {
      $(Result.of({ req, res, mid: merge(mid, { [key]: parse(body) }) }))
    } catch (error) {
      error.body = body

      setErrStatus(error, 400)

      $(Result.Error({req, res, error}))
    }
  })

  return $
}

function setErrStatus(error, status) {
  if (!error.status && !error.statusCode) {
    error.status = status
    error.statusCode = status
  }
}

module.exports = read
