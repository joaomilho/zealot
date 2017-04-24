/**
 * Routing.
 *
 * This module exports a couple of functions useful to create routes.
 */

const { toLower, map, pipe, split, filter, keys } = require('ramda');
const r = require('../result');

const pathToRegexp = require('path-to-regexp');

const compilePath = (pattern, options) => {
  const keys = [];
  const re = pathToRegexp(pattern, keys); //, options
  const compiledPattern = { re, keys };

  return compiledPattern;
};

const matchPath = (path, currentPath) => {
  const { re, keys } = compilePath(path, { end: false, strict: false });
  const match = re.exec(currentPath);

  if (!match) return null;

  const [url, ...values] = match;

  return keys.reduce((memo, key, index) => {
    memo[key.name] = values[index];
    return memo;
  }, {});
};

const match = req => ([method, path]) => {
  return (method === '*' || toLower(req.method) === toLower(method)) && matchPath(path, req.url);
};

const routify = (name, topic) =>
  map(key => {
    switch (key) {
      case 'all':
        return ['get', `/${name}`, topic.all];
      case 'get':
        return ['get', `/${name}/:id`, topic.get];
      case 'create':
        return ['post', `/${name}`, topic.create];
      case 'update':
        return ['put', `/${name}/:id`, topic.update];
      case 'delete':
        return ['delete', `/${name}/:id`, topic.delete];
    }
  }, keys(topic));

const restify = resource => ({
  all: context => {
    resource.all().then(items => {
      r.sendJSON(items, context);
    });
  },
  get: (context, { id }) => {
    return resource.get(id).then(item => {
      return item ? r.sendJSON(item, context) : r.sendJSON({}, context);
    });
  },
  create: context => {
    resource.create(context.mid.body).then(ok => {
      r.sendJSON({ ok }, context);
    });
  },
  update: (context, { id }) => {
    resource.update(id, context.mid.body).then(ok => {
      r.sendJSON({ ok }, context);
    });
  },
  delete: (context, { id }) => {
    resource.delete(id).then(ok => {
      r.sendJSON({ ok }, context);
    });
  },
});

const route = rs =>
  map(
    map(context => {
      const matchReq = match(context.req);
      return rs.find(([method, path, response]) => {
        const params = matchReq([method, path]);
        if (params) {
          response(context, params);
          return true;
        }
        return false;
      });
    })
  );

const crud = (name, topic) => routify(name, restify(topic));

module.exports = { route, routify, restify, crud, result: r };
