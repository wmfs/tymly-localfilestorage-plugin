/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
chai.use(require('chai-as-promised'))
const expect = chai.expect

const path = require('path')
const fs = require('fs')

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('copyFileToLocalPath', () => {
  let localstorage

  const rootPath = path.join(__dirname, 'fixture', 'methods', 'copy-from')
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

  const fileName = 'dog-names.txt'
  const localPath = path.join(__dirname, 'fixture', 'local')
  const remotePath = 'to-read'
  const remoteFilePath = path.join(remotePath, fileName)

  const localFileName = path.join(localPath, fileName)

  before(async () => {
    if (fs.existsSync(localFileName)) fs.unlinkSync(localFileName)

    localstorage = new LocalStorageService()
    await localstorage.boot(options)
  })

  after(() => {
    if (fs.existsSync(localFileName)) fs.unlinkSync(localFileName)
  })

  it('copy file locally', async () => {
    const localFile = await localstorage.copyFileToLocalPath(remoteFilePath, localPath)

    expect(fs.existsSync(localFile)).to.be.true()
    expect(path.resolve(localFile)).to.eql(path.resolve(path.join(localPath, fileName)))
  })

  describe('failure cases', () => {
    it('remote file does not exist', () => {
      return expect(
        localstorage.copyFileToLocalPath('bad-path', localPath)
      ).to.eventually.be.rejectedWith(Error)
    })

    it('remote path is a directory', () => {
      return expect(
        localstorage.copyFileToLocalPath(remotePath, localPath)
      ).to.eventually.be.rejectedWith(Error)
    })

    it('remote path tries to escape root', () => {
      return expect(
        localstorage.copyFileToLocalPath('../../../local/hello.txt', localPath)
      ).to.eventually.be.rejectedWith(Error)
    })

    it('local path does not exist', () => {
      return expect(
        localstorage.copyFileToLocalPath(remoteFilePath, path.join(localPath, 'some', 'nonsense'))
      ).to.eventually.be.rejectedWith(Error)
    })
  })
})
