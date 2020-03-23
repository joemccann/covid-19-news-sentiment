const test = require('tape')

const {
  sentiment
} = require('../src/cognitive')

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

let articles = null

test('pass -- extract articles', async t => {
  const { err, data } = await extractArticles({ html, messageId })
  t.ok(!err)
  t.ok(data)
  articles = data.articles
  t.end()
})

test('pass -- sentiment text', async t => {
  try {
    const text = []
    articles.forEach(el => {
      text.push(el.title)
    })
    const { err, data } = await sentiment({ text })

    t.ok(!err)
    t.ok(data)
    t.end()
  } catch (error) {
    console.error(error)
    t.end()
  }
})
