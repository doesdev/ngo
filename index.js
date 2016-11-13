'use strict'

// Setup
const path = require('path')
const https = require('https')
const execa = require('execa')
const isWin = process.platform === 'win32'
const goRelUrl = 'https://storage.googleapis.com/golang'
const vendor = path.resolve(__dirname, 'vendor')
const vendorRoot = path.join(vendor, 'go')
const bin = path.join(vendorRoot, 'bin')
const arch = process.arch.match(/64/) ? 'amd64' : '386'
let goRoot = process.env.GOROOT
let goPath = process.env.GOPATH

// Exports
module.exports = (args, opts) => {
  return new Promise((resolve, reject) => {
    init(args, opts).then(() => resolve(runCmd(args, opts))).catch(reject)
  })
}
module.exports.init = init
module.exports.cmd = runCmd

// Make sure we've got some Go-age
function init (opts) {
  opts = opts || {}
  if (opts.goRoot) goRoot = opts.goRoot
  if (opts.goPath) goPath = opts.goPath
  return new Promise((resolve, reject) => {
    resolveGoPaths(opts).then(resolve).catch(reject)
  })
}

// Prepare to run GO command
function runCmd (cmd, args, opts) {
  let noCmd = Array.isArray(cmd)
  opts = opts || (noCmd ? (args || {}) : {})
  args = noCmd ? cmd : (args || [])
  if (!noCmd) args.unshift(cmd)
  return execGoCmd(args, opts)
}

// Run GO command
function execGoCmd (args, opts) {
  let env = JSON.parse(JSON.stringify(process.env))
  let cmd = path.join(goRoot, 'bin', 'go')
  opts.env = Object.assign(env, opts.env || {})
  opts.env.GOROOT = goRoot
  opts.env.GOPATH = opts.goPath || opts.env.GOPATH || goPath
  opts.env.GOARCH = opts.goArch || opts.env.GOARCH || arch
  return execa(cmd, args, opts)
}

// Ensure we have necessary GO paths
function resolveGoPaths (opts) {
  return new Promise((resolve, reject) => {
    if (!goPath) goPath = path.join(vendor, 'gopath')
    if (!goRoot || opts.useLocal) return getGo().then(resolve).catch(reject)
    return resolve()
  })
}

// Use local Go or get latest Go
function getGo () {
  let pathExists = require('path-exists')
  return new Promise((resolve, reject) => {
    pathExists(bin).then((exists) => {
      if (!exists) return getLatestGo().then(resolve).catch(reject)
      goRoot = vendorRoot
      return resolve()
    }).catch(reject)
  })
}

// Get latest Go zip and resolve goRoot path
function getLatestGo () {
  return new Promise((resolve, reject) => {
    getGoVersions().then(downloadLatest).then(resolve).catch(reject)
  })
}

// Parse latest go versions from goRelUrl
function getGoVersions () {
  let parseXML = require('xml2js').parseString
  return new Promise((resolve, reject) => {
    let relRgx = new RegExp(/^go(\d+\.\d+\.\d+)/)
    https.get(goRelUrl, (res) => {
      let xml = ''
      let tags = {}
      res.on('error', reject)
      res.on('data', (data) => (xml += data.toString()))
      res.on('end', () => {
        parseXML(xml, (err, result) => {
          if (err) return reject(err)
          let root = result.ListBucketResult.Contents
          let rels = root.map((r) => (r.Key || [])[0])
          rels.forEach((r) => {
            tags[(((r || '').match(relRgx) || [])[1])] = true
          })
          rels = Object.keys(tags).filter((r) => r && r !== 'undefined')
          let latest = rels.sort().reverse()[0]
          return resolve(latest)
        })
      })
    }).on('error', reject)
  })
}

// Download latest GO version
function downloadLatest (tag) {
  let fs = require('fs')
  let platform = isWin ? 'windows' : process.platform
  let fileType = isWin ? 'zip' : 'tar.gz'
  let pkg = `go${tag}.${platform}-${arch}.${fileType}`
  let pkgUrl = `${goRelUrl}/${pkg}`
  let dest = path.join(vendor, pkg)
  return new Promise((resolve, reject) => {
    let arc = fs.createWriteStream(dest)
    arc.on('error', reject)
    https.get(pkgUrl, (res) => {
      res.pipe(arc).on('error', reject).on('close', () => {
        unpackArchive(dest).then(resolve).catch(reject)
      })
    }).on('error', reject)
  })
}

// Unpack GO archive
function unpackArchive (arc) {
  let decompress = require('decompress')
  let zip = require('decompress-unzip')
  let tar = require('decompress-targz')
  let fs = require('fs')
  return new Promise((resolve, reject) => {
    decompress(arc, vendor, {plugins: [zip(), tar()]}).then(() => {
      goRoot = vendorRoot
      fs.unlink(arc, (err) => { if (err) console.warn(err) })
      return resolve()
    }).catch(reject)
  })
}
