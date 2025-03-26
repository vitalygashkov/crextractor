# Crunchys

A utility to extract secrets from Crunchyroll mobile app

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [jadx](https://github.com/skylot/jadx)

## Installation

```bash
npm i crunchys
```

## Usage

#### Library

```js
import { extractSecrets } from 'crunchys';

const { id, secret, encoded, header } = await extractSecrets();

// Do something with the extracted secrets
```

#### Command-line interface

```bash
npx crunchys
```

## License

MIT
