/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
const expect = chai.expect

const path = require('path')
const fs = require('fs')

const { tearDownDirectories } = require('./test-helpers')

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('copyFileToRemotePath', () => {
  let localstorage

  const rootPath = path.join(__dirname, 'fixture', 'methods', 'to-write')
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

  before(() => {
    tearDownDirectories(rootPath)
    fs.mkdirSync(rootPath)

    localstorage = new LocalStorageService()
    localstorage.boot(options)
  })

  after(() => {
    tearDownDirectories(rootPath)
  })

  describe('happy path', () => {
    const fileName = 'hello.txt'
    const localPath = path.join(__dirname, 'fixture', 'local', fileName)
    const remotePath = path.join('to-write')

    it('make sure target folder exists and is empty', async () => {
      await localstorage.ensureFolderPath(remotePath)
      const contents = await localstorage.listFolderContentsFromPath(remotePath)
      expect(contents).to.have.length(0)
    })

    it('copy file to remote location', async () => {
      const remoteFile = await localstorage.copyFileToRemotePath(localPath, remotePath)
      expect(remoteFile).to.equal(path.join('to-write', remoteFile))
    })

    it('target folder lists the file', async () => {
      const contents = await localstorage.listFolderContentsFromPath(remotePath)
      expect(contents).to.have.length(1)
      expect(contents).to.deep.include({ Name: fileName })
    })
  })
})
