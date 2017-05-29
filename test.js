'use strict'

// setup
import test from 'ava'
import Ngo from './index'
const ngo = Ngo({useLocal: true})

test(`ngo('version') returns version`, async (assert) => {
  assert.regex((await ngo('version')).stdout, /^go version/)
})

test(`ngo(['version']) returns version`, async (assert) => {
  assert.regex((await ngo(['version'])).stdout, /^go version/)
})
