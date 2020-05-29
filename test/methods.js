/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
chai.use(require('chai-as-promised'))
const expect = chai.expect

const path = require('path')
const fs = require('fs')

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('exercise methods', () => {
  let localstorage

  const rootPath = path.join(__dirname, 'fixture', 'methods')
  const options = {
    bootedServices: {
      cloudstorage: {
        registerProvider: () => { }
      }
    },
    config: {
      localstorage: {
        rootPath: rootPath
      }
    }
  }

  beforeEach(() => {
    const cleanUp = fs.readdirSync(rootPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(rootPath, d.name))
      .filter(dir => fs.readdirSync(dir).length === 0)
    cleanUp.forEach(dir => fs.rmdirSync(dir))

    localstorage = new LocalStorageService()
    localstorage.boot(options)
  }) // beforeEach

  describe('ensureFolderPath', () => {
    describe('create good paths', () => {
      it('absolute paths are rooted in root path', async () => {
        await localstorage.ensureFolderPath('/absolute')

        expect(fs.existsSync(path.join(rootPath, 'absolute'))).to.be.true()
      })

      it('relative paths are resolved relative to root path', async () => {
        await localstorage.ensureFolderPath('relative')

        expect(fs.existsSync(path.join(rootPath, 'relative'))).to.be.true()
      })

      it('can create nested directories', async () => {
        const folderPath = 'one/two/three/deep'
        await localstorage.ensureFolderPath(folderPath)

        let checkPath = rootPath
        for (const p of folderPath.split('/')) {
          checkPath = path.join(checkPath, p)
          expect(fs.existsSync(checkPath)).to.be.true()
        }
      })
    }) // good paths

    describe('reject naughty paths that try to escape rootPath', () => {
      const badPaths = [
        '.',
        '..',
        '../../../poop',
        'start/out/ok/but/../../../../../../../oh'
      ]

      for (const p of badPaths) {
        it(p, () => {
          return expect(localstorage.ensureFolderPath(p)).to.eventually.be.rejectedWith(Error)
        })
      } // for ...
    })
  })

  describe('listFolderContentsFromPath', () => {
    describe('good path', () => {
      it ('folder with files', async () => {
        const list = await localstorage.listFolderContentsFromPath('to-read/sub-directory')
        expect(list).to.have.length(2)
      })

      it('empty folder', async () => {
        const list = await localstorage.listFolderContentsFromPath('to-read/empty')
        expect(list).to.have.length(0)
      })

      it ('folder with files and sub-folders', async () => {
        const list = await localstorage.listFolderContentsFromPath('to-read')
        expect(list).to.have.length(5)

        expect(list).to.deep.include({ Name: 'empty' })
        expect(list).to.deep.include({ Name: 'file-one.txt' })
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
})
