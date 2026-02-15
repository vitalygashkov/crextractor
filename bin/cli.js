#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { extract } from '../crextractor.js';

const args = parseArgs({
  options: {
    target: {
      type: 'string',
      default: 'tv',
    },
    output: {
      type: 'string',
    },
    cleanup: {
      type: 'boolean',
      default: true,
    },
  },
});

extract({
  target: args.values.target,
  output: args.values.output ?? (args.values.target === 'tv' ? 'credentials.tv.json' : 'credentials.mobile.json'),
  cleanup: args.values.cleanup,
});
