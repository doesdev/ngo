#! /usr/bin/env node
'use strict'

const ngo = require('./index.js')({update: true})
ngo().then((r) => console.log(r.stdout || r.stdout)).catch(console.error)
