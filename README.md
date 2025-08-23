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

### Fetching already extracted secrets

```js
async function main() {
  const url = 'https://raw.githubusercontent.com/vitalygashkov/crextractor/refs/heads/main/secrets.json';
  const data = await fetch(url).then((response) => response.json());

  // You can use the extracted secrets to obtain access tokens for Crunchyroll APIs
  const response = await fetch('https://beta-api.crunchyroll.com/auth/v1/token', {
    headers: {
      Authorization: data.authorization,
      // ...
    },
    method: 'POST',
    body: JSON.stringify({
      // ...
    }),
  });
}
```

#### Library

```js
import { extractSecrets } from 'crextractor';

const { id, secret, encoded, authorization } = await extractSecrets();

// Do something with the extracted secrets
```

#### Command-line interface

```bash
npx crextractor
```

> Results will be printed to the console and saved to `secrets.json` file

## License

MIT
