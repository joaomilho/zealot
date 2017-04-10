const {listen, on, ok, error} = require('../');

const json = require('../mid/json');
const {pipe, map} = require('ramda')

const recoverWith = require('../mid/recoverWith')

const mids = pipe(
  json({key: 'ff'}),
  map(recoverWith({key: 'ff', value: {}})),
  map(ok.sendJSONWith(({mid}) => ({response: mid}))),
  map(error.sendJSON({err: true}))
)(listen(8080))

on(ok.send('Hello'), listen(3000))
