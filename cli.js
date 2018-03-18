#! /usr/bin/env node
'use strict'

const args = process.argv.slice(2)
const go = require('./index.js')()(args)
go.stdout.pipe(process.stdout)
go.stderr.pipe(process.stderr)
go.catch(() => {})
