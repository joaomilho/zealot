const Result = require('folktale/data/result')
const {merge, map, chain} = require('ramda')

// const failRandomly = () => map(chain((context) => {
//   return Math.random() > 0.5
//     ? Result.Ok(context)
//     : Result.Error(merge(context, {err: 'random failure'}))
// }))

// const {midSyncChain} = require('../middleware')
// const failRandomly = midSyncChain(({Ok, Error}, context) =>
//   Math.random() > 0.5 ? Ok(context) : Error(merge(context, {err: 'random failure'})))

const {midAsyncChain} = require('../middleware')
const failRandomly = midAsyncChain(($, {Ok, Error}, context) => {
  setTimeout(() => {
    $(Math.random() > 0.5 ? Ok(context) : Error(merge(context, {err: 'random failure'})))
  }, 1000)
})

// const {listen, on} = require('../')
// const {pipe} = require('ramda')
//
// pipe(
//   failRandomly(),
//   map((result) => result.map((context) => {
//     context.res.end(JSON.stringify({ok: true}))
//   })),
//   map((result) => result.mapError((context) => {
//     context.res.end(JSON.stringify({ok: false, error: context.error}))
//   }))
// )(listen(8080))

const {listen, on, ok, error} = require('../')
const {pipe} = require('ramda')

pipe(
  failRandomly(),
  map(ok.sendJSON({ok: true})),
  map(error.sendJSONWith(({err}) => ({ok: false, err}))),
  on(() => console.log('OBSERVE!'))
)(listen(8080))
