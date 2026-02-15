# Crextractor

Utility for extracting credentials from the Crunchyroll Android app (both TV and mobile versions).

The [credentials](https://github.com/vitalygashkov/crextractor/blob/main/credentials.tv.json) are [automatically](https://github.com/vitalygashkov/crextractor/actions/workflows/extract.yml) updated once a week (if there are any changes).

## Usage

### Fetch ready credentials from this GitHub repository

```js
// Supported targets: mobile, tv
async function fetchCredentials(target = 'tv') {
  const url = `https://raw.githubusercontent.com/vitalygashkov/crextractor/refs/heads/main/credentials.${target}.json`;
  return fetch(url).then((response) => response.json());
}

async function main() {
  const credentials = fetchCredentials();

  // You can use credentials to obtain access tokens for Crunchyroll APIs

  // 3.54.5 (22304) -> 3.54.5_22304
  const userAgentAppVersion = credentials.version
    .replace(' ', '_')
    .replace('(', '')
    .replace(')', '');

  const response = await fetch('https://beta-api.crunchyroll.com/auth/v1/token', {
    headers: {
      // Ready HTTP header in the format `Basic <encoded>`, can be used to access some Crunchyroll APIs
      Authorization: credentials.authorization,
      'User-Agent': `Crunchyroll/ANDROIDTV/${userAgentAppVersion} (Android 16; en-US; sdk_gphone64_x86_64)`,
      // ...
    },
    method: 'POST',
    body: JSON.stringify({
      // ...
    }),
  });
}
```

### Extract fresh credentials from the latest APK using jadx

#### Prerequisites

- [Node.js](https://nodejs.org/en)
- [jadx](https://github.com/skylot/jadx)

```bash
npx crextractor --target mobile --output ./credentials.mobile.json
```

> Results will be printed to the console and saved to `credentials.mobile.json` file. By default, the target is TV, but you can change it with `--target mobile` option.

## License

MIT
