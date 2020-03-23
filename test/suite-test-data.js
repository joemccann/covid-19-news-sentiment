const test = require('tape')

const { generateArticles, writeArticlesFile } = require('../src/data')

test('sanity', t => {
  t.ok(true)
  t.end()
})

let content = null
const start = 202
const end = 204
const filename = [
  'test',
  String(start),
  String(end)
].join('-') + '.json'

test('pass - build data', async t => {
  const { err, data } = await generateArticles({ start, end })
  t.ok(!err)
  t.ok(data)
  t.ok(data.length)
  content = JSON.stringify(data)
  t.end()
})

test('pass - write data file', async t => {
  const { err, data } = await writeArticlesFile({
    content,
    filename
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})
