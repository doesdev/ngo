#! /usr/bin/env node
'use strict'

const args = process.argv.slice(2)
const goBinary = require('./index.js')().bin(args[0])(args.slice(1))
if (goBinary.stdout && goBinary.stderr) {
  goBinary.stdout.pipe(process.stdout)
  goBinary.stderr.pipe(process.stderr)
  goBinary.catch(() => {})
} else {
  goBinary.then((r) => console.log(r.stdout || r))
  goBinary.catch((err) => console.error(err.message || err))
}
