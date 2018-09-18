# boost2fs

[![NPM version](https://img.shields.io/npm/v/boost2fs.svg?style=flat)](https://npmjs.org/package/boost2fs)
[![Node version](https://img.shields.io/node/v/boost2fs.svg?style=flat)](https://github.com/viko16/boost2fs)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/viko16/boost2fs.svg?branch=master)](https://travis-ci.org/viko16/boost2fs)

🚀 Convert Boostnote to normal files.


## Install

``` bash
$ [sudo] npm install -g boost2fs
```

## Usage

```bash
Convert Boostnote to normal files.

Usage:
  b2f [baseDir] [options]

Commands:
  baseDir         Specify the input path, which includes 'boostnote.json' ( default: `process.cwd()` )

Options:
  --output, -o    Specify the output path  ( default: ./out )
  --version       Output version number
  --help          Output usage information
```

## Feature

- Export all notes into the output folder.
- Covert <u>Markdown Notes</u> to `{title}.md`.
- Covert <u>Snippet Notes</u> to `{title}/{filename}`.
- Deleted notes will be skipped.

## Limitation

- Tags, Star, Description in Snippet will be ignored. 🙈
- All filename will be sanitized. ( eg. `hello\u0000world` => `helloworld.md` )

## Thanks
- [BoostIO/Boostnote](https://github.com/BoostIO/Boostnote) - Note-taking app for programmers.

## License
MIT © [viko16](https://github.com/viko16)
