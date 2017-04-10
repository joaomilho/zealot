const { midElse } = require('../middleware')

const recoverWith = ({key, value}) => midElse(() => ({[key]: value}))

module.exports = recoverWith
