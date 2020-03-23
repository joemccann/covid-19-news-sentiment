<p align="center">
  <img alt="CVD-19 Virus" src="assets/img/botpic.jpg" />
</p>

# CVD-19 News Sentiment

A free, open source service that aims to determine the sentiment of news
and headlines around Coronavirus-19.

## Requirements

- [Microsoft Azure](https://portal.azure.com)
Account
- [VS Code](https://code.visualstudio.com/) for Production Deployment
and Local Development
- [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
VS Code Extension for Local Development
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
KEY=XXX
ENDPOINT=XXX
AZURE_TENANT_ID=XXX
AZURE_CLIENT_ID=XXX
AZURE_CLIENT_SECRET=XXX
AZURE_STORAGE_CONTAINER=XXX
BLOB_SERVICE_ACCOUNT_NAME=XXX
INCREMENT=XX
```

## Tests

> Note: a `.env` file is required to run the tests as they will affect Azure
resources.

```sh
npm i -D
npm test
```

## Contributing

The general guidelines for contributing are:

- Does it fix a bug?
- Does it break anything?
- Does it stick to the original goal?
- Does it reduce the build size?
- Is it necessary?

## Contributors

- [@joemccann](https://twitter.com/joemccann)

## License

MIT
