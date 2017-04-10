# Errors

As Murphy puts it "Anything that can go wrong, will go wrong". Therefore,
treating errors as exceptions is not the zealot way. We model errors in the same
kind of object we treat successes, that is, both are `Result`s. The only
differences are that while a success is a Result.Ok, errors are wrapped in
Result.Error and they'll include an `err` key in its value, so one can do
something about it:

```js
{
  req: http.ClientRequest,
  res: http.ServerResponse,
  err: {
    // ... error stuff
  }
}
```

### Generating errors

Let's imagine we wanna create a middleware than succeeds or fails randomly –
say, 50% of the time it succeeds, 50% it fails.

```js
const Result = require('folktale/data/result')
const {merge, map, chain} = require('ramda')

const failRandomly = () => map(chain((context) => {
  return Math.random() > 0.5
    ? Result.Ok(context)
    : Result.Error(merge(context, {err: 'random failure'}))
}))

module.exports = failRandomly
```

For more details on how to create your own middleware,
[read this]('./middleware'). All you need to understand here is what `map` and
`chain` means and how to create the results. So `map` and `chain` will be used
when you're doing something synchronous, but it may result in an error. That's
because if you're doing something asynchronous you'll need to create a new
stream, and therefore use flyd's `flatMap`. And `chain` is necessary because
you want to replace the current result being passed with the one you just
created.

Finally, `Result.Ok` simply passes the current result with the current context
down the stream, while `Result.Error` will pass down this context merged with a
custom error. In our case, the string 'random failure'.

For learning purposes, here's the async version:

```js
const Result = require('folktale/data/result')
const {merge, map, chain} = require('ramda')
const { stream } = require('flyd')
const flatMap = require('flyd/module/flatMap')

const failRandomly = () => flatMap(chain((context) => {
  const $ = stream()
  setTimeout(() => $(Math.random() > 0.5
    ? Result.Ok(context)
    : Result.Error(merge(context, {err: 'random failure'}))), 1000)
  return $
}))

module.exports = failRandomly
```

<cite>
You may be finding odd to have to deal with streams instead of regular Promises
and async/await stuff. Worry not, you can safely use Promises and then wrap them
into streams with a little bit of [knowledge from flyd](https://github.com/paldepind/flyd#using-promises-for-asynchronous-operations).
</cite>

Also, if you're finding this too verbose, you can always use some helpers:

```js
const {midSyncChain} = require('zealot-core/middleware')

const failRandomly = midSyncChain(({Ok, Error}, context) =>
  Math.random() > 0.5 ? Ok(context) : Error(merge(context, {err: 'random failure'})))
```

Or:

```js
const {midAsyncChain} = require('zealot-core/middleware')

const failRandomly = midAsyncChain(($, {Ok, Error}, context) =>
  setTimeout(() => {
    $(Math.random() > 0.5 ? Ok(context) : Error(merge(context, {err: 'random failure'})))
  }, 1000))
```

### Dealing with errors

So using our shinny new middleware, we can do the following:

```js
const {listen, on} = require('zealot-core')
const {pipe, map} = require('ramda')

pipe(
  failRandomly(),
  map((result) => result.map((context) => {
    context.res.end(JSON.stringify({ok: true}))
  })),
  map((result) => result.mapError((context) => {
    context.res.end(JSON.stringify({ok: false, err: context.err}))
  }))
)(listen(8080))
```

So after executing our middleware we're doing two things. Their main difference
is that in the first one, we're doing `result.map` and in the second one we're
doing `result.mapError`. As expected, `map` operates only when the
current result is `Ok`, while `mapError` operates only when the current result
is `Error`. Therefore, this two blocks are mutually exclusive, and, given our
middleware logic, they'll be executed only ~50% of the time each.

In both cases we're invoking `context.res.end`, which is `http`'s
low level function to return something to the client, but in the case of error
we're also returning the error string. Now, if you run a `curl` on that, you'll
get something like:

```sh
$ curl http://localhost:8080
{"ok":true}
$ curl http://localhost:8080
{"ok":false,"error":"random failure"}
```

Note this is the case _regardless_ if the middleware is sync or async.

But zealot comes with a couple of helpers to make this a little bit both
verbose, even though it's super important you understand how they work:

```js
const {listen, on, ok, error} = require('zealot-core')
const {pipe} = require('ramda')

pipe(
  failRandomly(),
  map(ok.sendJSON({ok: true})),
  map(error.sendJSONWith(({err}) => ({ok: false, err})))
)(listen(8080))
```

<cite>
This system assumes you only care about one error. If you think you care about
many, maybe what you want is to use the [Validation](http://origamitower.github.io/folktale/api/en/folktale.data.validation.html)
data type instead of Result.
</cite>
