# ngo [![NPM version](https://badge.fury.io/js/ngo.svg)](https://npmjs.org/package/ngo)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)   [![Dependency Status](https://dependencyci.com/github/doesdev/ngo/badge)](https://dependencyci.com/github/doesdev/ngo)   [![Build status](https://ci.appveyor.com/api/projects/status/0wutjytsl4hmha1j?svg=true)](https://ci.appveyor.com/project/doesdev/ngo)   [![Build Status](https://travis-ci.org/doesdev/ngo.svg)](https://travis-ci.org/doesdev/ngo)   

> Run Go commands from Node or CLI, Go env not required

Will download latest binaries locally if Go isn't already in PATH

### BONUS

If you run a command and it fails with "cannot find package..." we'll try to install
said package(s). YAYS. :relieved:

## local install

```sh
$ npm install --save ngo
```

## cli install

```sh
$ npm install --global ngo
```

## usage

#### cli usage
```sh
$ ngo version
# go version go1.8.3 windows/amd64

# to update the `ngo` install of Go (won't update system version)
$ ngo-update
# go version go1.9.4 windows/amd64
```

#### programmatic usage
returns promise that resolves to `execa` style object without the `child_process` goodies

```js
const goOpts = {}
const ngo = require('ngo')(goOpts)
const golint = ngo.bin('golint')

ngo('version').then(console.log).catch(console.error)
/* {
 stdout: 'go version go1.8.3 windows/amd64',
 stderr: '',
 code: 0,
 failed: false,
 killed: false,
 signal: null,
 cmd: 'C:\\Go\\bin\\go version'
} */

golint('main.go').then(console.log).catch(console.error)
```

## api

### const ngo = require('ngo')(`options`)
- **Purpose:** initialize `ngo`
- **Arguments:**
  - **options** *[`Object` - optional]*
    - **useLocal** *[`Boolean` `false`] - use locally downloaded Go binaries)*
    - **update** *[`Boolean` `false`] - update local install to latest*
    - **installDeps** *[`Boolean` `true`] - attempt to install missing packages*
    - **env** *[`Object`] - environment vars to set for the Go command*
    - **goRoot** *[`String`] - Go root path (ex. `/usr/local/go`)*
    - **goPath** *[`String`] - Go workspace path (ex. `~/work`)*
- **Returns:** `Function` (`ngo`) which executes Go commands

### ngo(`commandArgs`, `options`)
- **Purpose:** - execute `go` commands
- **Arguments:**
  - **commandArgs** *[`Array` | `String` - required] - argument(s) to call with `go` command*
  - **options** *[`Object` - optional]*
   - same options as [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
   - additonal options available same as [`execa`](https://github.com/sindresorhus/execa#options)
- **Returns:** `Promise` which resolves to [`execa`](https://github.com/sindresorhus/execa) styled object

### ngo.bin(`binary`)
- **Purpose:** - execute commands on binaries in the `GOBIN` directory
- **Arguments:**
  - **binary** [`String`] - name of binary file to be executed in returned function
- **Returns:** `Function` (identical to `ngo`, but runs specified binary instead of `go`)

### ngo.env
this is a copy of ngo's `process.env` with the Go environment variables added to it

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
