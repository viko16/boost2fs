const path = require('path')
const fs = require('mz/fs')
const mkdirp = require('mkdirp')
const cson = require('cson')

const cwd = process.cwd()
const defaultInputPath = './'
const defaultOutputPath = './out'

const NOTE_TYPE = {
  MARKDOWN_NOTE: 'MARKDOWN_NOTE',
  SNIPPET_NOTE: 'SNIPPET_NOTE'
}

class B2f {
  constructor (config = {}) {
    this.inputPath = path.resolve(cwd, config.inputPath || defaultInputPath)
    this.outputPath = path.resolve(cwd, config.outputPath || defaultOutputPath)
    this.folders = []
  }

  async start () {
    const folders = await this.readFoldersInfo()
    this.folders = folders.reduce((pre, cur) => {
      pre[cur.key] = cur.name
      return pre
    }, {})

    const notes = await this.listNotes()
    console.log(`Found ${notes.length} notes.`)

    for (let index = 0; index < notes.length; index++) {
      const note = notes[index]
      await this.readNote(note)
    }
    console.log('Done.')
  }

  async readFoldersInfo () {
    const filePath = path.resolve(this.inputPath, 'boostnote.json')
    console.log('reading ' + filePath)
    try {
      const info = await fs.readFile(filePath, 'utf-8')
      const json = JSON.parse(info)
      return json.folders
    } catch (error) {
      console.error('reading folders error', error)
      return []
    }
  }

  async listNotes () {
    const dirPath = path.resolve(this.inputPath, 'notes')
    console.log('reading ' + dirPath)
    try {
      return await fs.readdir(dirPath)
    } catch (error) {
      console.error('reading notes/ error', error)
      return []
    }
  }

  async readNote (fileName) {
    const filePath = path.resolve(this.inputPath, 'notes', fileName)
    // Parses a CSON file into an Object
    const parsedObj = await cson.load(filePath)
    if (parsedObj.type === NOTE_TYPE.MARKDOWN_NOTE) {
      await this.parseMarkdownNote(parsedObj)
    }
    if (parsedObj.type === NOTE_TYPE.SNIPPET_NOTE) {
      await this.parseSnippetNote(parsedObj)
    }
  }

  makeFolderDirectories (folderHash, nextFolder = '') {
    const folderName = this.folders[folderHash]
    const outputFolderPath = path.resolve(this.outputPath, folderName, nextFolder)
    mkdirp.sync(outputFolderPath)
    return outputFolderPath
  }

  async parseMarkdownNote (obj) {
    const { folder, title, content } = obj
    const outputFolderPath = this.makeFolderDirectories(folder)
    await fs.writeFile(path.resolve(outputFolderPath, title + '.md'), content, 'utf-8')
  }

  async parseSnippetNote (obj) {
    const { folder, title, snippets } = obj
    const outputFolderPath = this.makeFolderDirectories(folder, title)
    for (let i = 0; i < snippets.length; i++) {
      const { name, content } = snippets[i]
      await fs.writeFile(path.resolve(outputFolderPath, name), content, 'utf-8')
    }
  }
}

module.exports = B2f
