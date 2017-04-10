const Maybe = require('folktale/data/maybe')
const {type, find, findIndex, propEq} = require('ramda')

const products = [
  {id: 1, name: 'Banana', price: 2.56},
  {id: 2, name: 'Apple', price: 3.15}
]

const delay = (s, value) => new Promise((resolve) => {
  setTimeout(() => resolve(value), s * 1000)
})

const product = {
  all: () => {
    return delay(1, products)
  },
  get: (id) => {
    return delay(1, find(propEq('id', parseInt(id)), products))
  },
  create: (product) => {
    products.push(product)
    return delay(1, true)
  },
  update: (id, updates) => {
    const idx = findIndex(propEq('id', id), products)
    products[idx] = merge(products[idx], updates)
    return delay(1, true)
  },
  delete: (id) => {
    const idx = findIndex(propEq('id', id), products)
    if (idx === -1)
      return delay(1, false)

    products.splice(idx, 1)
    return delay(1, true)
  },
}

module.exports = product
