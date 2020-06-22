/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
chai.use(require('chai-as-promised'))
const expect = chai.expect

const path = require('path')
const fs = require('fs')

const { tearDownDirectories } = require('./test-helpers')

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('ensureFolderPath', () => {
  let localstorage

  const rootPath = path.join(__dirname, 'fixture', 'methods', 'ensure')
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
    tearDownDirectories(rootPath)
    fs.mkdirSync(rootPath)

    localstorage = new LocalStorageService()
    await localstorage.boot(options)
  }) // before

  after(() => {
    tearDownDirectories(rootPath)
  })

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
