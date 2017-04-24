const { pipe, map, on, listen } = require('..');
const { identity } = require('ramda');
// number of middleware

var n = parseInt(process.env.MW || '1', 10);
console.log('  %s zealot-local', n);
const mids = [];
while (n--) {
  mids.push(map(map(identity)));
}

var body = new Buffer('Hello World');

pipe(...mids, map(map(ctx => ctx.res.end(body))))(listen(3333));
