const test = require('tape')

const main = require('../src/data')

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - build data', async t => {
  const { err, data } = await main({ start: 202, end: 999 })
  t.ok(!err)
  t.ok(data)
  console.error(err)
  console.dir(data, { depth: null })
  console.log(data.length)
  t.end()
})
