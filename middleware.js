const {map, merge} = require('ramda')
const Result = require('folktale/data/result')
const { stream } = require('flyd')
const flatMap = require('flyd/module/flatMap')

const midElse = (fn) => (result) => result.orElse(({req, res, error, mid}) => {
  return Result.of({req, res, mid: merge(mid, fn({req, res, error}))})
})

const midOk = (fn) => (result) => result.map(({req, res, mid}) => {
  return {req, res, mid: merge(mid, fn({req, res, mid}))}
})

const midError = (fn) => (result) => result.mapError(({req, res, mid}) => {
  return {req, res, mid, error: fn({req, res})}
})

const midSyncChain = (fn) => map((result) => result.chain(({req, res, mid}) => {
  return fn(Result, {req, res, mid})
}))

const midAsyncChain = (fn) => flatMap((result) => result.chain(({req, res, mid}) => {
  const $ = stream()
  fn($, Result, {req, res, mid})
  return $
}))

module.exports = { midOk, midError, midElse, midSyncChain, midAsyncChain }
