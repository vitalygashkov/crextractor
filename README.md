# Crextractor

Utility for extracting credentials from the Crunchyroll Android app

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
  const url = 'https://raw.githubusercontent.com/vitalygashkov/crextractor/refs/heads/main/credentials.tv.json';
  const data = await fetch(url).then((response) => response.json());

  // You can use the extracted secrets to obtain access tokens for Crunchyroll APIs
  const response = await fetch('https://beta-api.crunchyroll.com/auth/v1/token', {
    headers: {
      Authorization: data.authorization,
      'User-Agent': 'Crunchyroll/ANDROIDTV/3.42.1_22267 (Android 16; en-US; sdk_gphone64_x86_64)',
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
import { extract } from 'crextractor';

const { id, secret, encoded, authorization } = await extract();

// Do something with the extracted secrets
```

#### Command-line interface

```bash
npx crextractor --target mobile --output ./credentials.mobile.json
```

> Results will be printed to the console and saved to `credentials.mobile.json` file. By default, the target is TV, but you can change it with `--target mobile` option.

## License

MIT
