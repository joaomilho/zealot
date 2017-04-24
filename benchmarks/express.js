var http = require('http');
var express = require('express');
var app = express();

// number of middleware

var n = parseInt(process.env.MW || '1', 10);
console.log('  %s express', n);

while (n--) {
  app.use(function(req, res, next) {
    next();
  });
}

var body = new Buffer('Hello World');

app.use(function(req, res, next) {
  res.send(body);
});

app.listen(3333);
