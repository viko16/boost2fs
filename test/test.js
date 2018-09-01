/* eslint-env mocha */

const path = require('path')
const fse = require('fs-extra')
const coffee = require('coffee')

const { assertFileExists } = require('./utils')
const binfile = path.resolve(__dirname, '../cli.js')
const fixturePath = path.resolve(__dirname, './fixtures')

describe('Usage', () => {
  const expectedFiles = [
    // Markdown
    path.resolve(fixturePath, 'out', 'Default/Welcome to Boostnote ).md'),
    path.resolve(fixturePath, 'out', `Default/${'very long content. '.repeat(20).substr(0, 200)}.md`),
    path.resolve(fixturePath, 'out', 'Default/Note title contains invalid characters like , abspath, u0000123.md'),
    // Snippet
    path.resolve(fixturePath, 'out', 'Default/Snippet note example/example.js'),
    path.resolve(fixturePath, 'out', 'Default/Snippet note example/example.html'),
    path.resolve(fixturePath, 'out', 'Default/Snippet title contains invalid characters like , abspath, u0000123/case1.js')
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
      .expect('stdout', [ /Found \d+ notes/, /Done/ ])
      .expect('code', 0)
      .end()
    await assertFileExists(expectedFiles)
  })

  it('should work with specified baseDir and --output', async () => {
    await coffee.fork(binfile, [ fixturePath, `--output=${fixturePath}/out` ])
      // .debug()
      .expect('stdout', [ /Found \d+ notes/, /Done/ ])
      .expect('code', 0)
      .end()
    await assertFileExists(expectedFiles)
  })
})

// TODO: Exception Handling
describe.skip('Exception Handling', () => {
})
