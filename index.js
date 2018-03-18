'use strict'

// setup
const path = require('path')
const execa = require('execa')
const exists = require('fs').existsSync
const vendor = path.resolve(__dirname, 'vendor')
const defGoRoot = path.join(vendor, 'go')
const defGoPath = path.join(vendor, 'gopath')
const defGoBin = path.join(defGoPath, 'bin')
const arch = process.arch.match(/64/) ? 'amd64' : '386'

// exports
module.exports = (opts = {}) => {
  let {env = {}, goRoot, goPath, goBin, goArch} = opts
  env = Object.assign(JSON.parse(JSON.stringify(process.env)), env, opts)
  if (opts.useLocal) goRoot = defGoRoot
  env.GOROOT = goRoot = goRoot || env.GOROOT || defGoRoot
  env.GOPATH = goPath = goPath || env.GOPATH || defGoPath
  env.GOBIN = goBin = goBin || env.GOBIN || defGoBin
  env.GOARCH = goArch = goArch || env.GOARCH || arch
  env.ngoBin = path.join(goRoot, 'bin', 'go')
  try { env.hasBin = exists(path.join(goRoot, 'bin')) } catch (ex) {}
  if (opts.update) delete env.hasBin
  return (args, cmdOpts = {}) => {
    if (opts.update) args = args || ['version']
    return runner(args, Object.assign({}, cmdOpts, {env}))
  }
}

function runner (args, opts) {
  if (!args) return Promise.reject(new Error(`No Go command specified`))
  args = Array.isArray(args) ? args : [args]
  let env = opts.env
  let lastDep
  let run = () => {
    let go = execa(env.ngoBin, args, opts)
    if (opts.installDeps === false) return go
    go.catch((err) => {
      let dep = (`${err}`.match(/cannot find package "(.+?)"/) || [])[1]
      if (!dep || lastDep === dep) return
      lastDep = dep
      let getDep = execa(env.ngoBin, ['get', dep], opts)
      return getDep.then(() => run()).catch(() => Promise.reject(err))
    })
    return go
  }
  if (env.hasBin) return run()
  return getGo(env.version, env.GOROOT).then(() => {
    env.hasBin = true
    return run()
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
