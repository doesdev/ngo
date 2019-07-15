'use strict'

const test = require('mvt')
const path = require('path')
const { remove } = require('fs-extra')
const ngo = require('./../index')
const goBinPath = path.resolve(__dirname, '..', 'vendor', 'go')

test.before(() => {
  let finish = () => ngo({ useLocal: true })('version')
  return remove(goBinPath).then(finish).catch(finish)
})

test(`go.env returns environment`, (assert) => {
  let go = ngo({ useLocal: true })
  assert.truthy(go.env.GOPATH)
  assert.truthy(go.env.GOROOT)
  assert.truthy(go.env.GOBIN)
})

test(`go('version') returns version`, async (assert) => {
  let go = ngo({ useLocal: true })
  assert.truthy((await go('version')).stdout.match(/^go version/))
})

test(`go(['version']) returns version`, async (assert) => {
  let go = ngo({ useLocal: true })
  assert.truthy((await go(['version'])).stdout.match(/^go version/))
})

test(`go(['get', 'somepackage']) works`, async (assert) => {
  let go = ngo({ useLocal: true })
  await assert.notThrowsAsync(() => go(['get', '-u', 'golang.org/x/lint/golint']))
})

test(`go.bin('golint')('errors.go') works`, async (assert) => {
  let golint = ngo({ useLocal: true }).bin('golint')
  let goFile = path.join(__dirname, 'fixtures', 'errors.go')
  let anError = /var unexp should have name of the form/
  let results = (await golint(goFile)).stdout
  assert.truthy(results.match(anError))
})

test(`go.bin('golint')('good.go') works`, async (assert) => {
  let golint = ngo({ useLocal: true }).bin('golint')
  let goFile = path.join(__dirname, 'fixtures', 'good.go')
  let results = (await golint(goFile)).stdout
  assert.falsy(results)
})
