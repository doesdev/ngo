'use strict'

// setup
const path = require('path')
const execa = require('execa')
const exists = require('fs').existsSync
const vendor = path.resolve(__dirname, 'vendor')
const defGoRoot = path.join(vendor, 'go')
const defGoPath = path.join(vendor, 'gopath')
const arch = process.arch.match(/64/) ? 'amd64' : '386'

// exports
module.exports = (opts = {}) => {
  let {env = {}, goRoot, goPath, goArch} = opts
  env = Object.assign(JSON.parse(JSON.stringify(process.env)), env, opts)
  if (opts.useLocal) goRoot = defGoRoot
  env.GOROOT = goRoot = goRoot || env.GOROOT || defGoRoot
  env.GOPATH = goPath = goPath || env.GOPATH || defGoPath
  env.GOARCH = goArch = goArch || env.GOARCH || arch
  env.ngoBin = path.join(goRoot, 'bin', 'go')
  try { env.hasBin = exists(path.join(goRoot, 'bin')) } catch (ex) {}
  return (cmd, args) => runner(cmd, args, env)
}

function runner (cmd, args, env) {
  if (!cmd) return Promise.reject(new Error(`No GO command specified`))
  cmd = Array.isArray(cmd) ? cmd : [cmd]
  args = Array.isArray(args) ? cmd.concat(args) : cmd
  if (env.hasBin) return execa(env.ngoBin, args, {env})
  return getGo(env.version, env.GOROOT).then(() => {
    env.hasBin = true
    return execa(env.ngoBin, args, {env})
  })
}

function getGo (version, dir) {
  let gv = require('go-versions')
  let gb = require('go-bin')
  let versionErr = () => new Error(`No matching version found`)
  return gv().then((versions) => {
    if (version && versions.indexOf(version) === -1) throw versionErr()
    version = version || versions[0]
    return gb({version, dir, includeTag: false})
  })
}
