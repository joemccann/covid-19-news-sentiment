require('dotenv').config()
const {
  extractArticles,
  getTelegramPostHTML
} = require('./telegram')

const { write } = require('./fs')

const pThrottle = require('p-throttle')

const generateArticles = async ({ start = 202, end = 9999 }) => {
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

  const limit = 1
  const interval = 200

  const throttled = pThrottle(async (messageId) => {
    console.log(`>>> Fetching message ID ${messageId}...`)

    const telegramUrl = `https://t.me/covid_19_updates/${messageId}?embed=1`

    const { err, data: html } = await getTelegramPostHTML({ telegramUrl })

    if (err) {
      console.error(err.message)
      return { err }
    } else {
      const { err, data } = await extractArticles({ html, messageId })
      if (err) console.error(err.message)
      //
      // Only add articles if they exist
      //
      if (data.articles && data.articles.length) {
        console.log(`pushing ${messageId}`)
        results.push(...data.articles)
      }
      return { data: 'ok' }
    }
  }, limit, interval)

  try {
    await Promise.all(messages.map(throttled))
    console.dir(results)

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
