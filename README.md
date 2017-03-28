# zealot

Server as a function for Node.js

## What?

Zealot is a layer on top of `http` making it a [stream](https://github.com/paldepind/flyd),
where values are of type [Result](http://origamitower.github.io/folktale/api/en/folktale.data.result.html)
(aka Either). This means all requests are manipulated with a stream processing
mindset, while errors are not treated as exceptions – but _expected_ outcomes.

### Hello world

Let's start with the hello world:

```js
const {ok, on, listen} = require('zealot-core')

on(ok.send('Hello'), listen(3000))
```

Let's understand: `listen(3000)` will initiate an `http` server and return
a stream.

`on` is used to perform some side effect on the stream. In this case, the
intended side effect is to reply with 'Hello', so the `ok.send` is used.
`ok.send` only operates over results that are `Ok`.

### Slightly trickier example

Now, let's see something slightly trickier. Let's imagine that we want to parse
the request body and return it:

```js
const {listen, on, ok} = require('zealot-core');
const {json} = require('zealot-core/mid');
const flatMap = require('flyd/module/flatMap');
const pipe = require('ramda/src/pipe')

pipe(
  flatMap(json()),
  on(ok.sendJSONWith(({mid}) => mid.body))
)(listen(8080))
```

First thing we introduced here is `pipe`, from [Ramda](http://ramdajs.com/). It
is the equivalent of method chaining in the functional world. It produces a
function that receives a parameter, passes it to it's first argument, passes the
result of that to the second argument and so on. In our case, it receives our
stream, and passes it to `flatMap`. The result of `flatMap` is then passed to
`on`.

I'll explain the `flatMap` right after we understand what `json()` does. First
of all, it's not completely different than any Express middleware: its main
function is to get a response and parse the body as json. The differences here
are 1) that `json` returns another stream and 2) that it doesn't write the body
in the request itself, instead the object that is passed around looks like this:

```js
{
  req: http.ClientRequest,
  res: http.ServerResponse,
  mid: {
    // ... middleware stuff
  }
}
```

Because it returns a stream, we need the `flatMap`. It simply means "continue
with the new stream from now on".

When we get to `on`, we can access the body by getting the `mid` object and
returning the `body` key of it.

Note you can change in which key you want any middleware to deposit its results,
so you avoid namespace clashes. Also, that you could use a functional helper to
make sure you're not getting the classic `undefined` errors in JS:

```js
const path = require('ramda/src/path')
...
  flatMap(json({key: 'body/json'})),
  on(ok.sendJSONWith(path(['mid', 'body/json']))
```

### Errors

Now, a json parse may fail, and I stated above that we don't use exceptions to
deal with that, since the object that is passed in our stream is an instance of
Result. This means that, if things go well, we'll have a Response.Ok object in
the `on` method, so we succeed sending our json body back to the user. If things
go otherwise we'll have a Response.Error, with the following stuff:

```js
{
  req: http.ClientRequest,
  res: http.ServerResponse,
  err: {
    // ... error stuff
  }
}
```

And we can deal with errors like this:

```js
const {listen, on, ok, error} = require('.');
...

pipe(
  flatMap(json()),
  on(ok.sendJSONWith(({mid}) => mid.body)),
  on(error.sendJSON({error: true}),
)(listen(8080))
```

Note the difference between `sendJSON` and `sendJSONWith` is that the former
sends a fixed JSON, while the later gets a function that receives our context
and must return a JSON, useful when we need to get info from the request or the
middleware. This becomes obvious if you take a look at the implementation:
`const sendJSON = pipe(always, sendJSONWith)`.

## Goals

- Truly functional
- Clear, hackable code
- API focused
- As safe as JS can be without transpiler crap

## Motivation

- `http` standard lib is too low level
- connect & express have a very ad-hoc API, rely on in-place updates of requests
and responses, has many arbitrary arity functions, and lots of backward
compatibility code;
- follow more or less the ["your server as a function"](https://monkey.org/~marius/funsrv.pdf) architecture;
- rely on the best tools out there

## Install

```sh
yarn add zealot-core
```

## Status

Extremely experimental.
