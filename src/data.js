require('dotenv').config()

const pThrottle = require('p-throttle')

const {
  extractArticles,
  getTelegramPostHTML
} = require('./telegram')

const { write } = require('./fs')

const { sentiment } = require('./cognitive')

const limit = parseInt(process.env.THROTTLE_LIMIT || 0) || 3
const interval = parseInt(process.env.THROTTLE_INTERVAL || 0) || 3000

const generateArticles = async ({ start = 1, end = 99999 }) => {
  //
  // Step 1: Cycle through all the posts
  //
  const results = []
  const messages = []

  //
  // Populate array from start to finish with messageIds
  //
  for (let i = start; i <= end; i++) {
    messages.push(i)
  }

  const throttled = pThrottle(async (messageId) => {
    const telegramUrl = `https://t.me/covid_19_updates/${messageId}?embed=1`

    const { err, data: html } = await getTelegramPostHTML({ telegramUrl })

    if (err) {
      console.error(err)
      return { err }
    } else {
      const { err, data } = await extractArticles({ html, messageId })
      if (err) console.error(err.message)
      //
      // Only add articles if they exist
      //
      const { articles = [] } = data
      if (articles.length) {
        console.log(`>>> Analyzing Sentiment for ${messageId}`)
        const text = []

        articles.forEach(el => {
          text.push(el.title)
        })

        const {
          err: sentimentErr,
          data: sentimentData
        } = await sentiment({ text })

        if (sentimentErr) console.error(sentimentErr)
        else {
          const merge = articles.map((item, i) =>
            Object.assign({}, item, sentimentData[i]))

          results.push(...merge)
        }
      }
      return { data: 'ok' }
    }
  }, limit, interval)

  try {
    await Promise.all(messages.map(throttled))

    const unique = []
    const map = new Map()
    for (const item of results) {
      //
      // Check to see if the Map has the title (could check URL)
      //
      if (!map.has(item.title)) {
        //
        // Set any value to Map for future loops
        //
        map.set(item.title, true)
        unique.push(item)
      }
    }
    //
    // Return the unique set
    //
    return { data: unique }
  } catch (err) {
    return { err }
  }
}

const writeArticlesFile = async ({
  content = '',
  filename = '',
  container = ''
}) => {
  container = process.env.AZURE_STORAGE_CONTAINER || container

  if (!content) return { err: new Error('Missing `content` parameter.') }
  if (!filename) return { err: new Error('Missing `filename` parameter.') }
  if (!container) return { err: new Error('Missing `container` parameter.') }

  const { err, data } = await write({
    content,
    container,
    filename
  })
  if (err) return { err }
  return { data }
}

module.exports = { generateArticles, writeArticlesFile }
