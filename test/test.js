/* eslint-env mocha */

const path = require('path')
const fse = require('fs-extra')
const coffee = require('coffee')

const { assertFileExists } = require('./utils')
const binfile = path.resolve(__dirname, '../cli.js')
const fixturePath = path.resolve(__dirname, './fixtures')

describe('Usage', () => {
  const expectedFiles = [
    path.resolve(fixturePath, 'out', 'Default/Welcome to Boostnote :).md'),
    path.resolve(fixturePath, 'out', 'Default/Snippet note example/example.js'),
    path.resolve(fixturePath, 'out', 'Default/Snippet note example/example.html')
  ]

  afterEach(async () => {
    const out = path.resolve(fixturePath, 'out')
    await fse.remove(out)
  })

  it('should show help', done => {
    coffee.fork(binfile, ['--help'])
      .expect('stdout', /Usage/)
      .expect('code', 0)
      .end(done)
  })

  it('should work without any arguments', async () => {
    await coffee.fork(binfile, [], { cwd: fixturePath })
      // .debug()
      .expect('stdout', [ /Found 2 notes/, /Done/ ])
      .expect('code', 0)
      .end()
    await assertFileExists(expectedFiles)
  })

  it('should work with specified baseDir and --output', async () => {
    await coffee.fork(binfile, [ fixturePath, `--output=${fixturePath}/out` ])
      // .debug()
      .expect('stdout', [ /Found 2 notes/, /Done/ ])
      .expect('code', 0)
      .end()
    await assertFileExists(expectedFiles)
  })
})

// TODO: Exception Handling
describe.skip('Exception Handling', () => {
})
