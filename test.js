'use strict'

// setup
import test from 'ava'
import Ngo from './index'
const ngo = Ngo({useLocal: true})

test(`ngo(['version']) returns version`, async (assert) => {
  let version = (await ngo(['version'])).stdout
  assert.regex(version, /^go version/)
})
