# Getting started

Ok, so you wanna begin. Let's start by installing zealot. You probably want to
start with a fresh project. So:

```
mkdir myProject
cd myProject
yarn init
```

Follow yarn's instructions and then you can do:

```
yarn add zealot-core
```

### Hello world

Let's start our new project with the hello world:

```js
const {ok, on, listen} = require('zealot-core')

on(ok.send('Hello'), listen(3000))
```

Let's understand: `listen(3000)` will initiate an `http` server and return
a stream.

`on` is used to perform some side effect on the stream. In this case, the
intended side effect is to reply with 'Hello', so the `ok.send` is used.
`ok.send` only operates over results that are `Ok`.

### What's next?

Now you can go over the other tutorials, and also dig deeper in the libraries
that are the pillars of zealot: [ramda](http://ramdajs.com/docs/),
[flyd](https://github.com/paldepind/flyd) and
[folktale](origamitower.github.io/folktale).
