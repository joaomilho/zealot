const {listen, on, ok} = require('../')
const json = require('../mid/json')
const product = require('./product')
const {route, crud} = require('../mid/route')
const {pipe} = require('ramda')

const routes = route([
  ...crud('product', product),
  ['*', '*', () => ok.send('NOT FOUND')]
]),

pipe(
  json(),
  routes,
  on(() => console.log('OBSERVE!'))
)(listen(8080))
