# ngo [![NPM version](https://badge.fury.io/js/ngo.svg)](https://npmjs.org/package/ngo)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Run go commands, whether your go env is in place or not

Will download latest binaries locally if GO isn't already in PATH

## local install

```sh
$ npm install --save ngo
```

## cli install

```sh
$ npm install --global ngo
```

## api

### ngo
returns promise which resolves to [`execa`](https://github.com/sindresorhus/execa) styled object
- **arguments** *(Array, arguments to call with `go` command - required)*
- **options** *(Object - optional)*
  - **useLocal** *(Boolean, use locally downloaded GO binaries - optional)*
  - **env** *(Object, environment vars to set for the GO command - optional)*
  - **goRoot** *(String, GO root path (ex. `/usr/local/go`) - optional)*
  - **goPath** *(String, GO workspace path (ex. `~/work`) - optional)*
  - **reject** *(Boolean, set to `false` to resolve the promise on stderr instead of rejecting - optional)*

### ngo.init
returns promise that resolves when `ngo` is ready for `cmd`
- **options** *(Object - optional)*
  - **useLocal** *(Boolean, use locally downloaded GO binaries - optional)*

### ngo.cmd
returns `execa` styled [`child_process`](https://nodejs.org/api/child_process.html#child_process_class_childprocess) instance with promise-cuity
- **command** *(String, (ex. 'build') - optional - if ommitted signature is shifted)*
- **arguments** *(Array, arguments to call with `go` command - optional)*
- **options** *(Object - optional)*
  - **env** *(Object, environment vars to set for the GO command - optional)*
  - **goRoot** *(String, GO root path (ex. `/usr/local/go`) - optional)*
  - **goPath** *(String, GO workspace path (ex. `~/work`) - optional)*
  - **reject** *(Boolean, set to `false` to resolve the promise on stderr instead of rejecting - optional)*

## usage

#### cli usage
```sh
$ ngo version
# go version go1.7.1 windows/amd64
```

#### default usage
returns promise that resolves to `execa` style object without the `child_process` goodies

```js
const ngo = require('ngo')

ngo(['version']).then(console.log).catch(console.error)
/* {
  stdout: 'go version go1.7.1 windows/amd64',
  stderr: '',
  code: 0,
  failed: false,
  killed: false,
  signal: null,
  cmd: 'C:\\Go\\bin\\go version'
} */
```

#### alternate syntax
init - returns promise and must be called before cmd    
cmd - returns `execa` styled `child_process` instance

```js
let cmd = () => {
  let child = ngo.cmd('version', {reject: false})
  child.stdout.pipe(process.stdout)
  // go version go1.7.1 windows/amd64
  child.stderr.pipe(process.stderr)
  child.catch(console.error)
}
ngo.init().then(cmd).catch(console.error)
```

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
