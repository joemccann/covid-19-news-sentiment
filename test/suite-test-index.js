require('dotenv').config()
const test = require('tape')

const { read } = require('../src/fs')

const build = require('..')

const container = process.env.AZURE_STORAGE_CONTAINER

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - build', async t => {
  //
  // Step 1: read in the file
  //
  const { err, data: meta } = await read({
    container,
    filename: 'job-data.json'
  })

  if (err) {
    console.error(err)
    t.end()
    return { err }
  }

  const { lastId } = meta

  {
    const { err, data } = await build({
      start: lastId,
      increment: 5
    })

    if (err) {
      console.error(err)
      t.end()
      return { err }
    }

    console.log(data)
    t.end()
    return { data }
  }
})
