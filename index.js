const path = require('path')
const fs = require('fs-extra')
const cson = require('cson')
const ora = require('ora')
const colors = require('colors/safe')
const sanitizeFilename = require('sanitize-filename')

const cwd = process.cwd()
const DEFAULT_INPUT_PATH = './'
const DEFAULT_OUTPUT_PATH = './out'

const NOTE_TYPE = {
  MARKDOWN_NOTE: 'MARKDOWN_NOTE',
  SNIPPET_NOTE: 'SNIPPET_NOTE'
}

class B2f {
  constructor (config = {}) {
    this.inputPath = path.resolve(cwd, config.inputPath || DEFAULT_INPUT_PATH)
    this.outputPath = path.resolve(cwd, config.outputPath || DEFAULT_OUTPUT_PATH)
    this.folders = {}
  }

  async run () {
    try {
      this.ora = ora({
        text: 'Searching',
        stream: process.stdout
      }).start()
      this.folders = await this.readFoldersInfo()

      const notes = await this.listNotes()
      this.ora.stopAndPersist({ text: `Found ${notes.length} notes.` }).start()

      for (let index = 0; index < notes.length; index++) {
        const note = notes[index]
        await this.readNote(note)
      }
      this.ora.succeed(colors.green('Done.'))
    } catch (err) {
      this.ora.fail(colors.red(err.message))
    }
  }

  async readFoldersInfo () {
    const filePath = path.resolve(this.inputPath, 'boostnote.json')
    this.ora.text = `Reading ${filePath}`
    const info = await fs.readFile(filePath, 'utf-8')
    const json = JSON.parse(info)
    const folders = json.folders
    return folders.reduce((result, { key, name }) => {
      result[key] = name
      return result
    }, {})
  }

  async listNotes () {
    const dirPath = path.resolve(this.inputPath, 'notes')
    this.ora.text = `Reading ${dirPath}`
    const files = await fs.readdir(dirPath)
    return files.filter(item => item.endsWith('.cson'))
  }

  async readNote (fileName) {
    const filePath = path.resolve(this.inputPath, 'notes', fileName)
    // Parses a CSON file into an Object
    const parsedObj = await cson.load(filePath)
    // Skip the deleted note
    if (parsedObj.isTrashed === true) return

    switch (parsedObj.type) {
      case NOTE_TYPE.MARKDOWN_NOTE:
        await this.parseMarkdownNote(parsedObj)
        break
      case NOTE_TYPE.SNIPPET_NOTE:
        await this.parseSnippetNote(parsedObj)
        break
      default:
        console.info('unhandle type: ', parsedObj.type)
        break
    }
  }

  async makeFolderDirectories (folderHash, nextFolder = '') {
    const folderName = this.folders[folderHash]
    const outputFolderPath = path.resolve(this.outputPath, folderName, nextFolder)
    await fs.ensureDir(outputFolderPath)
    return outputFolderPath
  }

  async parseMarkdownNote (obj) {
    const { folder, title, content } = obj
    const outputFolderPath = await this.makeFolderDirectories(folder)
    const safeTitle = this.sanitizeTitle(title)
    await fs.writeFile(path.resolve(outputFolderPath, safeTitle + '.md'), content, 'utf-8')
  }

  async parseSnippetNote (obj) {
    const { folder, title, snippets } = obj
    const safeTitle = this.sanitizeTitle(title)
    const outputFolderPath = await this.makeFolderDirectories(folder, safeTitle)
    for (let i = 0; i < snippets.length; i++) {
      let { name, content } = snippets[i]
      // the snippet without name
      if (!name) name = '<noname>' + i
      await fs.writeFile(path.resolve(outputFolderPath, name), content, 'utf-8')
    }
  }

  sanitizeTitle (title) {
    // remove directory paths and invalid characters, see viko16/boost2fs#1
    // fix unexpected too long title, see viko16/boost2fs#2
    return sanitizeFilename(title).substr(0, 200) || '<noname>'
  }
}

module.exports = B2f
