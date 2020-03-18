<p align="center">
  <img alt="CVD-19 Virus" src="assets/botpic.jpg" />
</p>

# CVD-19 News Sentiment

A free, open source service that aims to determine the sentiment of news and headlines around Coronavirus-19.

## Requirements

- [Microsoft Azure](https://portal.azure.com) Account
- [VS Code](https://code.visualstudio.com/) for Production Deployment and Local Development
- [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) VS Code Extension for Local Development
- [Node.js LTS Version](https://nodejs.org/en/about/releases/)

## Hacking

- Clone this repo and install dependencies.

```sh
git clone https://github.com/joemccann/covid-19-news-sentiment.git
cd covid-19-new-sentiment
npm i
```

- Create a `.env` file in the root of the repo and copy/paste the following:

```sh
KEY=YOUR-AZURE-COGNITIVE-SERVICES-KEY
ENDPOINT-YOUR-AZURE-COGNITIVE-SERVICES-ENDPOINT
```

## Tests

```sh
npm i -D
npm test
```


## Contributing

The general guidelines for contributing are:

- Does it fix a bug?
- Does it break anything?
- Does it stick to the original goal of The CVD Bot (an informational Telegram bot to keep up withg the CVD-19 virus)
- Does it reduce the build size?
- Is it necessary?

## Contributors

- [@joemccann](https://twitter.com/joemccann)

## License

MIT
