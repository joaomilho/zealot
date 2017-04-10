# zealot

Server as a function for Node.js

## What?

Zealot is a layer on top of `http` making it a [stream](https://github.com/paldepind/flyd),
where values are of type [Result](http://origamitower.github.io/folktale/api/en/folktale.data.result.html)
(aka Either). This means all requests are manipulated with a stream processing
mindset, while errors are not treated as exceptions – but _expected_ outcomes.


### Routing


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
