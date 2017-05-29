'use strict'

// setup
import test from 'ava'
import ngo from './index'

test(`ngo(['version']) returns version`, async (assert) => {
  let version = (await ngo(['version'])).stdout
  assert.regex(version, /^go version/)
})
