const Result = require('folktale/data/result')
const {merge, map, chain} = require('ramda')
const { stream } = require('flyd')
const flatMap = require('flyd/module/flatMap')

const failRandomly = () => flatMap(chain((context) => {
  const $ = stream()
  setTimeout(() => $(Math.random() > 0.5
    ? Result.Ok(context)
    : Result.Error(merge(context, {error: 'random failure'}))), 1000)
  return $
}))

const {listen, on, ok, error} = require('../')
const {pipe} = require('ramda')

pipe(
  failRandomly(),
  map(ok.sendJSON({ok: true})),
  map(error.sendJSON({ok: false})),
  on(() => console.log('OBSERVE!'))
)(listen(8080))
