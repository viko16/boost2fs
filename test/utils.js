const fse = require('fs-extra')
const assert = require('assert')

async function assertFileExists (list) {
  for (let idx = 0; idx < list.length; idx++) {
    const file = list[idx]
    assert.ok(await fse.exists(file), `${file}, no such file`)
  }
}

module.exports = {
  assertFileExists
}
