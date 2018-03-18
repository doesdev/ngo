#! /usr/bin/env node
'use strict'

const go = require('./index.js')({update: true})()
go.stdout.pipe(process.stdout)
go.stderr.pipe(process.stderr)
go.catch(() => {})
