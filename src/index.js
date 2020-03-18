const fetch = require('node-fetch')
const cheerio = require('cheerio')

const extract = ($) => {
  const articles = []
  const parse = function (i, elem) {
    try {
      const children = $(this).children()
      const text = $(this).text().split(' - ')

      articles.push({
        img: children[0].attribs.src,
        url: children[1].attribs.href,
        title: text[0].trim(),
        timestamp: text[1]
      })
    } catch (error) {
      console.error(error)
    }
  }
  $('li').each(parse)
  return articles
}

module.exports = async ({ telegramUrl = '' }) => {
  //
  // Update 202 is the beginning of content
  //
  const NEWS_URL = URL || 'https://t.me/s/covid_19_updates/{}'

  try {
    const response = await fetch(NEWS_URL)

    if (!response.ok) return { err: new Error(response.statusText) }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles = extract($) || []

    return { data: { articles } }
  } catch (err) {
    return { err }
  }
}
