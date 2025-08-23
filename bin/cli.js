#!/usr/bin/env node

const { parseArgs } = require('node:util');
const { extract } = require('../crextractor');

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
      default: false,
    },
  },
});

extract({
  target: args.values.target,
  output: args.values.output ?? (args.values.target === 'tv' ? 'credentials.tv.json' : 'credentials.mobile.json'),
  cleanup: args.values.cleanup,
});
