#! /usr/bin/env node
'use strict'

const args = process.argv.slice(2)
const go = require('./index.js')()(args)
if (go.stdout && go.sterr) {
  go.stdout.pipe(process.stdout)
  go.stderr.pipe(process.stderr)
  go.catch(() => {})
} else {
  go.then((r) => console.log(r.stdout))
  go.catch((err) => console.error(err.message || err))
}
