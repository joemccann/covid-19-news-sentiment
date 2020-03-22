require('dotenv').config()

const fs = require('fs')
const {
  generateArticles,
  writeArticlesFile
} = require('./src/data')

const compare = (a, b) => {
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
  const start = 3478
  const end = 3500
  const filename = [String(start), '-', String(end), '.json'].join('')

  {
    const { err, data } = await generateArticles({ start, end })
    if (err) {
      console.error(err)
      return { err }
    }
    console.log('>>> Sorting...')
    data.sort(compare)
    console.log(data.length)
    content = JSON.stringify(data)
  }

  {
    console.log('>>> Writing file...')
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

  filename = ['./assets/json/', filename].join('')

  let content = null
  try {
    content = JSON.parse(await fs.promises.readFile(filename))
  } catch (err) {
    console.error(err.message)
    return { err }
  }

  console.dir(content)

  try {
    const text = []

    content.forEach(el => {
      text.push(el.title)
    })

    console.log(text)

    const { err, data: sentimentData } = await sentiment({ text })

    if (err) {
      console.error(err)
      return { err }
    }

    sentimentData.forEach(result => {
      console.log(result.message)
    })

    console.dir(sentimentData, { depth: null })
    //
    // Merge the results with the file so the sentiment scores
    // are associated with the articles
    //
    const merged = JSON.stringify([...sentimentData, ...content])

    //
    // Write merged file...
    //
    const written = await fs.promises.write('merged-' + filename, merged)
    console.log(`written: ${written}`)
    return { data: written }
  } catch (err) {
    console.error(err)
    return { err }
  }
}

build()

// senitmentFromFile({ filename: '2637-3216.json' })

module.exports = build
