const server = require('.');
const {sendJSON} = require('./helpers');
// const text = require('./text');
// const json = require('./json');
// const router = require('./router');
// const pipe = require('ramda/src/pipe');
const map = require('ramda/src/map');
// const of = require('most').of;

const routes = {
  '/foo/:id': id => ({ res }) => {
    throw new Error('HAHAHAHAHA');
    res.end('FOO WITH ID' + id);
  },
  '*': ({ res }) => res.end('*'),
};


server(8080)
  // .map()
  .map(sendJSON({a: 1}))
  // .chain(json())
  // .map(router(routes))
  // .delay(5000)
  // .tap(({ error, res }) => {
  //   if (error) {
  //     res.end(error.message);
  //   }
  // })
  .observe(() => console.log('OBSERVE'))
  // .observe(r => {
  //   return r.matchWith({
  //     Ok:    ({ value }) => `Ok: ${value.toString()}`,
  //     Error: ({ value }) => `Error: ${value}`
  //   });
  // })
  .catch(e => console.log('eee', e));
