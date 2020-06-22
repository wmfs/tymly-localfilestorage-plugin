/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
const expect = chai.expect

const path = require('path')
const fs = require('fs')

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('listFolderContentsFromPath', () => {
  let localstorage

  const rootPath = path.join(__dirname, 'fixture', 'methods', 'list')
  const emptyDir = path.join(rootPath, 'to-read', 'empty')

  const options = {
    bootedServices: {
      cloudstorage: {
        registerProvider: () => { }
      },
      temp: {
        makeTempDir: () => { }
      }
    },
    config: {
      localstorage: {
        rootPath: rootPath
      }
    }
  }

  before(async () => {
    if (!fs.existsSync(emptyDir)) fs.mkdirSync(emptyDir)

    localstorage = new LocalStorageService()
    await localstorage.boot(options)
  })

  after(() => {
    fs.rmdirSync(emptyDir)
  })

  describe('good path', () => {
    it('folder with files', async () => {
      const list = await localstorage.listFolderContentsFromPath('to-read/sub-directory')
      expect(list).to.have.length(2)
    })

    it('empty folder', async () => {
      const list = await localstorage.listFolderContentsFromPath('to-read/empty')
      expect(list).to.have.length(0)
    })

    it('folder with files and sub-folders', async () => {
      const list = await localstorage.listFolderContentsFromPath('to-read')
      expect(list).to.have.length(5)
      const names = list.map(c => c.Name)
      expect(names).to.include('empty')
      expect(names).to.include('file-one.txt')
    })
  })

  describe('return nothing for bad paths', () => {
    const badPaths = [
      '..',
      '../..',
      '../../../poop',
      'start/out/ok/but/../../../../../../../oh',
      'good/path/but/which/does/not/exist'
    ]

    for (const p of badPaths) {
      it(p, async () => {
        const list = await localstorage.listFolderContentsFromPath(p)
        expect(list).to.have.length(0)
      })
    }
  })
})
