#!/usr/bin/env node

const meow = require('meow')
const B2f = require('.')
const pkg = require('./package.json')

const cli = meow(`
  Usage:
    b2f [baseDir] [options]

  Commands:
    baseDir         Specify the input path, which includes 'boostnote.json' ( default: process.cwd() )

  Options:
    -o, --output    Specify the output path   ( default: ./out )
    -v, --version   Output version number     ( v${pkg.version} now )
    -h, --help      Output usage information
`, {
  alias: {
    h: 'help',
    v: 'version',
    o: 'output'
  }
})

const config = {
  inputPath: cli.input[0] || null,
  outputPath: cli.flags.output || null
}

if (cli.flags.output === true) {
  console.error(`Value for 'output' of type '[String]' required.`)
} else {
  new B2f(config).run()
}
