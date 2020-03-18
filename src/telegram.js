const fetch = require('node-fetch')
const cheerio = require('cheerio')

const isStatsPost = (html = '') => {
  if (!html) return { err: new Error('No html to evaluate if news or stats.') }
  return { data: html.includes('🦠 Total Number of Cases:') }
}

//
// Return a list of articles as an array
//
const extractArticles = ({ html = '', messageId = 0 }) => {
  if (!html) {
    return { err: new Error('Missing `html` parameter.') }
  }

  if (!messageId) {
    return { err: new Error('Missing `postId` parameter.') }
  }

  if (!isStatsPost(html)) {
    return { data: [] }
  }
  const $ = cheerio.load(html)

  const timestamp = $('time').attr('datetime') || null

  const articles = []
  const parse = function (i, elem) {
    try {
      const href = $(this).attr('href')
      const title = ($(this).text()).trim()
      articles.push({
        href,
        messageId,
        timestamp,
        title
      })
    } catch (error) {
      console.error(error)
    }
  }
  $('.tgme_widget_message_text.js-message_text > a').each(parse)

  return { data: { articles } }
}

//
// Fetch the message post and return HTML
//
const getTelegramPostHTML = async ({ telegramUrl = '' }) => {
  if (!telegramUrl) return { err: new Error('Missing Telegram URL.') }

  try {
    const response = await fetch(telegramUrl)

    if (!response.ok) return { err: new Error(response.statusText) }

    const html = await response.text()
    return { data: html }
  } catch (err) {
    return { err }
  }
}

module.exports = {
  extractArticles,
  getTelegramPostHTML
}
