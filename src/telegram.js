const fetch = require('node-fetch')
const cheerio = require('cheerio')

const isStatsPost = (html = '') => {
  if (!html) return { err: new Error('No html to evaluate if news or stats.') }
  return { data: html.includes('🦠 Total Number of Cases:') }
}

const isNotFound = (html = '') => {
  if (!html) return { err: new Error('No html to evaluate if not found.') }
  const data = html.includes('<b>@covid_19_updates</b> not found') ||
      html
        .includes('class="tgme_widget_message_error" dir="auto">Post not found')
  return {
    data
  }
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

  //
  // Bail on a "not found" page (not a 404)
  //
  {
    const { err, data: noPostFound } = isNotFound(html)
    if (err) return { err }
    if (noPostFound) return { data: [] }
  }

  //
  // Bail on a stats page
  //
  {
    const { err, data: isStats } = isStatsPost(html)
    if (err) return { err }
    if (isStats) return { data: [] }
  }

  const $ = cheerio.load(html)

  const articles = []
  const timestamp = $('.datetime').attr('datetime') || null

  if (!timestamp) {
    const err = new Error('No timestamp for ' +
    `https://t.me/covid_19_updates/${messageId}?embed=1`)
    console.error(err.message)
  } else {
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
  }
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
