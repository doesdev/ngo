'use strict'

// setup
import path from 'path'
import { remove } from 'fs-extra'
import test from 'ava'
import ngo from './../index'
const goBinPath = path.resolve(__dirname, '..', 'vendor', 'go')

test.before(() => {
  let finish = () => ngo({useLocal: true})('version')
  return remove(goBinPath).then(finish).catch(finish)
})

test.serial(`go.env returns environment`, (assert) => {
  let go = ngo({useLocal: true})
  assert.truthy(go.env.GOPATH)
  assert.truthy(go.env.GOROOT)
  assert.truthy(go.env.GOBIN)
})

test.serial(`go('version') returns version`, async (assert) => {
  let go = ngo({useLocal: true})
  assert.regex((await go('version')).stdout, /^go version/)
})

test.serial(`go(['version']) returns version`, async (assert) => {
  let go = ngo({useLocal: true})
  assert.regex((await go(['version'])).stdout, /^go version/)
})

test.serial(`go(['get', 'somepackage']) works`, async (assert) => {
  let go = ngo({useLocal: true})
  await assert.notThrows(go(['get', '-u', 'golang.org/x/lint/golint']))
})

test.serial(`go.bin('golint')('errors.go') works`, async (assert) => {
  let golint = ngo({useLocal: true}).bin('golint')
  let goFile = path.join(__dirname, 'fixtures', 'errors.go')
  let anError = /var unexp should have name of the form/
  let results = (await golint(goFile)).stdout
  assert.regex(results, anError)
})

test.serial(`go.bin('golint')('good.go') works`, async (assert) => {
  let golint = ngo({useLocal: true}).bin('golint')
  let goFile = path.join(__dirname, 'fixtures', 'good.go')
  let results = (await golint(goFile)).stdout
  assert.falsy(results)
})
