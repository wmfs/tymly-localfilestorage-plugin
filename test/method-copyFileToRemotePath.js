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

describe('copyFileToRemotePath', () => {
  let localstorage

  const rootPath = path.join(__dirname, 'fixture', 'methods', 'copy-to')
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

  const fileName = 'hello.txt'
  const renamedFileName = 'world.txt'
  const localPath = path.join(__dirname, 'fixture', 'local', fileName)
  const remotePath = path.join('to-write')

  before(async () => {
    tearDownDirectories(rootPath)
    fs.mkdirSync(rootPath)

    localstorage = new LocalStorageService()
    await localstorage.boot(options)
  })

  after(() => {
    tearDownDirectories(rootPath)
  })

  describe('happy path', () => {
    it('make sure target folder exists and is empty', async () => {
      await localstorage.ensureFolderPath(remotePath)
      const contents = await localstorage.listFolderContentsFromPath(remotePath)
      expect(contents).to.have.length(0)
    })

    it('copy file to remote folder', async () => {
      const remoteFile = await localstorage.copyFileToRemotePath(localPath, remotePath)
      expect(remoteFile).to.equal(path.join('/', 'to-write', fileName))
    })

    it('copy file to remote folder, giving filename', async () => {
      const remoteFile = await localstorage.copyFileToRemotePath(localPath, remotePath, renamedFileName)
      expect(remoteFile).to.equal(path.join('/', 'to-write', renamedFileName))
    })

    it('target folder lists the file', async () => {
      const contents = await localstorage.listFolderContentsFromPath(remotePath)
      expect(contents).to.have.length(2)
      const names = contents.map(c => c.Name)
      expect(names).to.include(fileName)
      expect(names).to.include(renamedFileName)
    })
  })

  describe('failure cases', () => {
    it('local file does not exist', () => {
      return expect(
        localstorage.copyFileToRemotePath('missing', remotePath)
      ).to.eventually.be.rejectedWith(Error)
    })

    it('remote path does not exist', () => {
      return expect(
        localstorage.copyFileToRemotePath(localPath, 'badpath')
      ).to.eventually.be.rejectedWith(Error)
    })

    it('remote path tries to escape root', () => {
      return expect(
        localstorage.copyFileToRemotePath(localPath, '..')
      ).to.eventually.be.rejectedWith(Error)
    })
  })
})
