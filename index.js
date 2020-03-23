require('dotenv').config()

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

//
// Start = beginning messageId
// Increment = Start + some offset of a future message
//
const build = async ({ start = 0, increment = 0 }) => {
  if (!start) return { err: new Error('Missing `start` parameter') }
  if (!increment) return { err: new Error('Missing `increment` parameter') }

  //
  // If the starting messageId is 329, then the end should the start
  // plus the increment value, 1329...
  //
  const end = start + increment
  let content = null
  let lastId = null

  {
    const { err, data } = await generateArticles({ start, end })
    if (err) {
      console.error(err)
      return { err }
    }
    data.sort(compare)
    content = JSON.stringify(data)
    lastId = (data.pop()).messageId
  }

  {
    console.log('>>> Writing file...')
    const filename = [
      'messages-',
      String(start),
      '-',
      String(lastId),
      '.json'].join('')

    const { err, data } = await writeArticlesFile({
      content,
      filename
    })

    if (err) {
      console.error(err.message)
      return { err }
    }
    return { data }
  }
}

module.exports = build
