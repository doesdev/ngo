#! /usr/bin/env node
'use strict'

// Setup
const ngo = require('./index.js')
const args = process.argv.slice(2)

// Main

// Standard sig, resolves to the same as execa object
// ngo(args).then((execa) => console.log(execa.stdout)).catch(console.error)

// Init and cmd call sequence, ngo.cmd returns execa type of return
let cmd = () => {
  let child = ngo.cmd(args, {reject: false})
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.catch(console.error)
}
ngo.init().then(cmd).catch(console.error)
