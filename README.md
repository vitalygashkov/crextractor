# Crextractor

Utility for extracting secrets from Crunchyroll mobile app

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [jadx](https://github.com/skylot/jadx)

## Installation

```bash
npm i crextractor
```

## Usage

#### Library

```js
import { extractSecrets } from 'crextractor';

const { id, secret, encoded, header } = await extractSecrets();

// Do something with the extracted secrets
```

#### Command-line interface

```bash
npx crextractor
```

> Results will be printed to the console and saved to `secrets.json` file

## License

MIT
