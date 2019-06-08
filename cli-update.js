#! /usr/bin/env node
'use strict'

const go = require('./index.js')({ update: true })()
if (go.stdout && go.stderr) {
  go.stdout.pipe(process.stdout)
  go.stderr.pipe(process.stderr)
  go.catch(() => {})
} else {
  go.then((r) => console.log(r.stdout || r))
  go.catch((err) => console.error(err.message || err))
}
