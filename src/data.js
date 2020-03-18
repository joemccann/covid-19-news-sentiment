const {
  extractArticles,
  getTelegramPostHTML
} = require('./telegram')

const { read, write } = require('./fs')

const main = async ({ start = 202, end = 212 }) => {
  //
  // Step 1: Cycle through all the posts
  //
  const results = []
  const messages = []

  //
  // Populate array from start to finish
  //
  for (let i = start; i <= end; i++) {
    messages.push(i)
  }

  const promises = messages.map(async (messageId) => {
    console.log(`Fetching message ID ${messageId}...`)

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
      if (data.articles.length) {
        results.push(...data.articles)
      }
      return { data: 'ok' }
    }
  })

  try {
    await Promise.all(promises)

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

module.exports = main
