require('dotenv').config()
const test = require('tape')
const pkg = require('../package.json')

const { read, write } = require('../src/fs')

const container = 'covid-19-sentiment-container'

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - write blob storage file pass', async t => {
  const content = JSON.stringify(pkg)
  const { err, data } = await write({
    content,
    container,
    filename: 'pkg.json'
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - read blob storage file', async t => {
  const { err, data } = await read({
    container,
    filename: 'pkg.json'
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('fail - read blob storage file', async t => {
  const { err, data } = await read({
    container,
    filename: 'fail.json'
  })
  t.ok(err)
  t.ok(!data)
  t.equals(err.message, 'Unexpected status code: 404')
  t.end()
})
