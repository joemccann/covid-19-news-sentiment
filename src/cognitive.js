require('dotenv').config()

const {
  TextAnalyticsClient,
  TextAnalyticsApiKeyCredential
} = require('@azure/ai-text-analytics')

const sentiment = async ({ key = '', endpoint = '', text = [] }) => {
  key = process.env.KEY || key
  endpoint = process.env.ENDPOINT || endpoint

  if (!key) return { err: new Error('Missing Key.') }

  if (!endpoint) return { err: new Error('Missing Endpoint.') }

  if (!text.length) {
    return { err: new Error('Missing array of text to analyze.') }
  }

  try {
    const client = new TextAnalyticsClient(endpoint,
      new TextAnalyticsApiKeyCredential(key))
    const sentimentResult = await client.analyzeSentiment(text)

    const data = []

    sentimentResult.forEach(document => {
      const message = []
      const {
        id = null,
        sentiment = null,
        confidenceScores = {},
        sentences = []
      } = document

      const {
        positive = 0,
        negative = 0,
        neutral = 0
      } = confidenceScores

      const result = {
        id,
        sentiment,
        positive,
        negative,
        neutral,
        sentences
      }
      message.push(`\n\nID: ${id}`)
      message.push(`Document Sentiment: ${sentiment}`)
      message.push(`Positive: ${positive.toFixed(2)}`)
      message.push(`Negative: ${negative.toFixed(2)}`)
      message.push(`Neutral: ${neutral.toFixed(2)}`)
      message.push(`\nSentences Sentiment (${sentences.length} Total):`)
      sentences.forEach(s => {
        message.push(`Sentence sentiment: ${s.sentiment}`)
        message.push('\nSentences Scores:')
        message.push(`Positive: ${s.confidenceScores.positive.toFixed(2)}`)
        message.push(`Negative: ${s.confidenceScores.negative.toFixed(2)}`)
        message.push(`Neutral: ${s.confidenceScores.neutral.toFixed(2)}`)
      })
      result.message = message.join('\n')
      data.push(result)
    })
    return { data }
  } catch (err) {
    return { err }
  }
}

module.exports = { sentiment }
