#!/usr/bin/env node

const meow = require('meow')
const B2f = require('.')

const cli = meow(`
  Usage:
    b2f [baseDir] [options]

  Commands:
    baseDir         Specify the input path, which includes 'boostnote.json' ( default: process.cwd() )

  Options:
    --output, -o    Specify the output path  ( default: ./out )
    --version       Output version number
    --help          Output usage information
`, {
  flags: {
    output: {
      type: 'string',
      default: './out',
      alias: 'o'
    }
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
