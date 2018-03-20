'use strict'

// setup
import path from 'path'
import { remove } from 'fs-extra'
import test from 'ava'
import ngo from './index'
const goBinPath = path.resolve(__dirname, '..', 'vendor', 'go')

test.before(() => {
  let finish = ngo({useLocal: true})('version')
  return remove(goBinPath).then(finish).catch(finish)
})

test(`go('version') returns version`, async (assert) => {
  let go = ngo({useLocal: true})
  assert.regex((await go('version')).stdout, /^go version/)
})

test(`go(['version']) returns version`, async (assert) => {
  let go = ngo({useLocal: true})
  assert.regex((await go(['version'])).stdout, /^go version/)
})

test(`go(['get', '-u', 'golang.org/x/lint/golint']) works`, async (assert) => {
  let go = ngo({useLocal: true})
  await assert.notThrows(go(['get', '-u', 'golang.org/x/lint/golint']))
})

test(`go.env returns environment`, (assert) => {
  let go = ngo({useLocal: true})
  assert.truthy(go.env.GOPATH)
  assert.truthy(go.env.GOROOT)
  assert.truthy(go.env.GOBIN)
})
