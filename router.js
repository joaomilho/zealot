const switchPath = require('switch-path').default;
const merge = require('ramda/src/merge');

const router = routes => context => {
  try {
    const location = context.req.url;
    const r = switchPath(location, routes);

    r.value(context);
  } catch (error) {
    return merge(context, { error });
  }
  return context;
};

module.exports = router;
