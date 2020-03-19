const test = require('tape')

const { generateArticles, writeArticlesFile } = require('../src/data')

test('sanity', t => {
  t.ok(true)
  t.end()
})

let content = null
const start = 202
const end = 499
const filename = [String(start), '-', String(end), '.json'].join('')

test('pass - build data', async t => {
  const { err, data } = await generateArticles({ start, end })
  t.ok(!err)
  t.ok(data)
  console.log(data.length)
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
  console.error(err)
  console.dir(data, { depth: null })
  t.end()
})
