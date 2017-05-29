#! /usr/bin/env node
'use strict'

// Setup
const ngo = require('./index.js')()
const args = process.argv.slice(2)

// Main
ngo(args).then((r) => console.log(r.stdout || r.stdout)).catch(console.error)
