const { midOk } = require('./middleware')

const stupid = (opts = {}) => midOk(({req, res}) => {
  return {foo: 'bar'}
})

module.exports = stupid
