/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
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
    fs.rmdirSync(rootPath, { recursive: true })
    fs.mkdirSync(rootPath)

    localstorage = new LocalStorageService()
    localstorage.boot(options)
  }) // beforeEach

  describe('ensureFolderPath', () => {
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
  })
})
