const test = require('tape')

const {
  extractArticles,
  getTelegramPostHTML
} = require('../src/telegram')

const messageId = 202
let html = ''

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass -- fetch telegram post HTML', async t => {
  const telegramUrl = `https://t.me/covid_19_updates/${messageId}?embed=1`
  const { err, data } = await getTelegramPostHTML({ telegramUrl })
  t.ok(!err)
  t.ok(data)
  html = data
  t.end()
})

test('pass -- extract articles', async t => {
  const { err, data } = await extractArticles({ html, messageId })
  t.ok(!err)
  t.ok(data)
  t.end()
})
