'use strict'

const test = require('mvt')
const path = require('path')
const { remove } = require('fs-extra')
const ngo = require('./../index')
const goBinPath = path.resolve(__dirname, '..', 'vendor', 'go')

test.before(() => {
  const finish = () => ngo({ useLocal: true })('version')
  return remove(goBinPath).then(finish).catch(finish)
})

test('go.env returns environment', (assert) => {
  const go = ngo({ useLocal: true })
  assert.truthy(go.env.GOPATH)
  assert.truthy(go.env.GOROOT)
  assert.truthy(go.env.GOBIN)
})

test('go(\'version\') returns version', async (assert) => {
  const go = ngo({ useLocal: true })
  assert.truthy((await go('version')).stdout.match(/^go version/))
})

test('go([\'version\']) returns version', async (assert) => {
  const go = ngo({ useLocal: true })
  assert.truthy((await go(['version'])).stdout.match(/^go version/))
})

test('go([\'get\', \'somepackage\']) works', async (assert) => {
  const go = ngo({ useLocal: true })
  await assert.notThrowsAsync(() => go(['get', '-u', 'golang.org/x/lint/golint']))
})

test('go.bin(\'golint\')(\'errors.go\') works', async (assert) => {
  const golint = ngo({ useLocal: true }).bin('golint')
  const goFile = path.join(__dirname, 'fixtures', 'errors.go')
  const anError = /var unexp should have name of the form/
  const results = (await golint(goFile)).stdout
  assert.truthy(results.match(anError))
})

test('go.bin(\'golint\')(\'good.go\') works', async (assert) => {
  const golint = ngo({ useLocal: true }).bin('golint')
  const goFile = path.join(__dirname, 'fixtures', 'good.go')
  const results = (await golint(goFile)).stdout
  assert.falsy(results)
})
