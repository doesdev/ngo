#! /usr/bin/env node
'use strict'

const semver = require('semver')
const maybeVersion = process.argv.slice(2)[0]
const version = semver.valid(maybeVersion) ? maybeVersion : undefined

const go = require('./index.js')({ update: true, env: { version } })()
if (go.stdout && go.stderr) {
  go.stdout.pipe(process.stdout)
  go.stderr.pipe(process.stderr)
  go.catch(() => {})
} else {
  go.then((r) => console.log(r.stdout || r))
  go.catch((err) => console.error(err.message || err))
}
