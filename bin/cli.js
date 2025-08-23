#!/usr/bin/env node

const { extractSecrets } = require('../crextractor');

extractSecrets({ output: 'secrets.json' });
