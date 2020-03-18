require('dotenv').config()
const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')

const streamToString = async (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', (data) => {
      chunks.push(data.toString())
    })
    readableStream.on('end', () => {
      resolve(chunks.join(''))
    })
    readableStream.on('error', reject)
  })
}

const createBlobServiceClient = (account) => {
  //
  // Authenticate and then connect to the Blob Storage
  //
  const BLOB_SERVICE_ACCOUNT_NAME = account ||
  process.env.BLOB_SERVICE_ACCOUNT_NAME

  const defaultAzureCredential = new DefaultAzureCredential()

  return new BlobServiceClient(
    `https://${BLOB_SERVICE_ACCOUNT_NAME}.blob.core.windows.net`,
    defaultAzureCredential
  )
}

//
// Asssumes the file in blob storage is a JSON file as this method
// return a JSON object.  Anything else with throw an exception.
//
const read = async ({ account, container, filename }) => {
  const blobServiceClient = createBlobServiceClient(account)
  try {
    //
    // Now, fetch the file from blob storage file
    //
    const containerClient = blobServiceClient.getContainerClient(container)

    const blobClient = containerClient.getBlobClient(filename)
    const { readableStreamBody } = await blobClient.download()

    const content = await streamToString(readableStreamBody)

    return { data: JSON.parse(content) }
  } catch (err) {
    return { err }
  }
}

//
// Content is expected to be UTF-8 string data.
//
const write = async ({ account, container, filename, content }) => {
  const blobServiceClient = createBlobServiceClient(account)

  try {
    const containerClient = blobServiceClient.getContainerClient(container)
    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    const { requestId } = await blockBlobClient.upload(content, content.length)

    if (!requestId) {
      return {
        err: new Error(`Failed to confirm uploading of file, 
        ${filename} to blob storage. No requestId was returned. Try again.
        `)
      }
    }

    return { data: requestId }
  } catch (err) {
    return { err }
  }
}

module.exports = { read, write }
