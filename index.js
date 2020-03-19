require('dotenv').config()

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
    console.dir(data)
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
    console.dir(data, { depth: null })
    return { data }
  }
}

build()

module.exports = build
