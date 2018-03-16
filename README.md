# ngo [![NPM version](https://badge.fury.io/js/ngo.svg)](https://npmjs.org/package/ngo)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)   [![Dependency Status](https://dependencyci.com/github/doesdev/ngo/badge)](https://dependencyci.com/github/doesdev/ngo)

> Run Go commands, whether your Go env is in place or not

Will download latest binaries locally if Go isn't already in PATH

## local install

```sh
$ npm install --save ngo
```

## cli install

```sh
$ npm install --global ngo
```

## api

### require('ngo')(opts)
accepts `opts` as below, returns `ngo` function which executes Go commands
- **options** *(Object - optional)*
  - **useLocal** *(Boolean, use locally downloaded Go binaries - optional)*
  - **env** *(Object, environment vars to set for the Go command - optional)*
  - **goRoot** *(String, Go root path (ex. `/usr/local/go`) - optional)*
  - **goPath** *(String, Go workspace path (ex. `~/work`) - optional)*
  - **update** *(Boolean, Update local install to latest - optional)*

### ngo(arguments, options)
returns promise which resolves to [`execa`](https://github.com/sindresorhus/execa) styled object
- **arguments** *(Array | String, argument(s) to call with `go` command - required)*
- **options** *(Object - optional)*
 - same options as [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
 - additonal options available same as [`execa`](https://github.com/sindresorhus/execa#options)

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
```

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
