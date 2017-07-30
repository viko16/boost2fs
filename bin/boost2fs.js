#!/usr/bin/env node

require('async-to-gen/register')
const meow = require('meow')
const B2f = require('../lib')
const pkg = require('../package.json')

const cli = meow(`
  Boost2fs v${pkg.version}
  Conversion Boostnote to normal files.

  Usage:
    b2f [dir] [options]

  Options:
    --output        Specify the output patch - default: ./out
    -v, --version   Output version number
    -h, --help      Output usage information
`, {
  alias: {
    h: 'help',
    v: 'version'
  }
})

const config = {
  inputPath: cli.input[0] || null,
  outputPath: cli.flags.output || null
}

if (cli.flags.output === true) {
  console.error(`Value for 'output' of type '[String]' required.`)
} else {
  const b2f = new B2f(config)
  b2f.start()
}
