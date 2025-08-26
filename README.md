# Crextractor

Utility for extracting credentials from the Crunchyroll Android app (both TV and mobile versions).

The [credentials](https://github.com/vitalygashkov/crextractor/blob/main/credentials.tv.json) are [automatically](https://github.com/vitalygashkov/crextractor/actions/workflows/extract.yml) updated once a week (if there are any changes).

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [jadx](https://github.com/skylot/jadx)

## Usage

### Library

```bash
npm i crextractor
```

#### Fetch ready credentials from this GitHub repository

```js
import { pull } from 'crextractor';

async function main() {
  const credentials = await pull('tv');

  // You can use the extracted credentials to obtain access tokens for Crunchyroll APIs
  const response = await fetch('https://beta-api.crunchyroll.com/auth/v1/token', {
    headers: {
      Authorization: credentials.authorization, // Ready HTTP header in the format `Basic <encoded>`, can be used to access some Crunchyroll APIs
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

#### Extract credentials from the latest APK using jadx

```js
import { extract } from 'crextractor';

async function main() {
  const { id, secret, encoded, authorization } = await extract();
  // id - Crunchyroll app ID
  // secret - Crunchyroll app secret
  // encoded - Base64 encoded `id:secret` string
  // authorization - ready HTTP header in the format `Basic <encoded>`, can be used to access some Crunchyroll APIs

  // Do something with the extracted credentials
}
```

### Command-line interface

```bash
npx crextractor --target mobile --output ./credentials.mobile.json
```

> Results will be printed to the console and saved to `credentials.mobile.json` file. By default, the target is TV, but you can change it with `--target mobile` option.

## License

MIT
