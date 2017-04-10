/**
 * Example of regular routing
 *
 * If you're looking for an example of a CRUD, look into crud.js.
 */

const {listen, on} = require('../')
const json = require('../mid/json')
const {route, result} = require('../mid/route')
const {pipe} = require('ramda')

const key = 'customKey'

pipe(
  json({key}),
  route([
    ['get', '/foo/', result.send('OK!')],
    ['get', '/foo/:id/:name/:other', (context, params) => result.sendJSON(params, context)],
    ['post', '/bar/', (context) => result.sendJSON(context.mid[key], context)],
    ['*', '*', result.send('NOT FOUND')]
  ]),
  on(() => console.log('OBSERVE!'))
)(listen(8080))
