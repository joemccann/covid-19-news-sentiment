require('dotenv').config()
const fs = require('fs')
const { generateArticles, writeArticlesFile } = require('./src/data')

function compare (a, b) {
  const id1 = a.messageId
  const id2 = b.messageId

  let comparison = 0
  if (id1 > id2) {
    comparison = 1
  } else if (id1 < id2) {
    comparison = -1
  }
  return comparison
}

const build = async () => {
  let content = null
  const start = 202
  const end = 2800
  const filename = [String(start), '-', String(end), '.json'].join('')

  {
    const { err, data } = await generateArticles({ start, end })
    if (err) {
      console.error(err.message)
      return { err }
    }
    data.sort(compare)
    console.log(data.length)
    content = JSON.stringify(data)
  }

  {
    const { err, data } = await writeArticlesFile({
      content,
      filename
    })
    if (err) {
      console.error(err.message)
      return { err }
    }
    console.dir(data)
    return { data }
  }
}

const { sentiment } = require('./src/cognitive')

const senitmentFromFile = async ({ filename = '' }) => {
  if (!filename) return { err: new Error('Mising `filename` parameter') }

  filename = ['./assets/json', filename].join('')

  let content = null
  try {
    content = await fs.promises.open(filename, 'r')
  } catch (err) {
    console.error(err.message)
    return { err }
  }

  try {
    const text = []

    content.forEach(el => {
      text.push(el.title)
    })

    const { err, data: sentimentData } = await sentiment({ text })

    console.error(err)

    sentimentData.forEach(result => {
      console.log(result.message)
    })
    console.dir(sentimentData, { depth: null })
    //
    // Merge the results with the file so the sentiment scores
    // are associated with the articles
    //
    const merged = merge({ sentimentData, articlesData })
    const merged = [...sentimentData, ...articlesData];

    content = await fs.promises.write('merged-' + filename, merged)
  } catch (err) {
    console.error(err)
    return { err }
  }
}

// build()

senitmentFromFile({ filename: '202-2637.json' })

module.exports = build
