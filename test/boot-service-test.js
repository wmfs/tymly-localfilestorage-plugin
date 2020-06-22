/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-string'))
chai.use(require('chai-as-promised'))
const expect = chai.expect

const path = require('path')

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('Boot localstorage service', () => {
  let localstorage
  let options

  const basePath = path.join(__dirname, 'fixture')

  beforeEach(() => {
    localstorage = new LocalStorageService()

    options = {
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
          rootPath: path.join(basePath, 'config')
        }
      }
    }
  }) // beforeEach

  afterEach(() => {
    delete process.env.TYMLY_LOCALSTORAGE_ROOTPATH
  })

  describe('good boots', () => {
    it('picks up filesystem root directory from config', async () => {
      await localstorage.boot(options)
      expect(localstorage.rootPath).to.endWith('config')
    })

    it('picks up filesystem root directory from environment', async () => {
      delete options.config.localstorage
      process.env.TYMLY_LOCALSTORAGE_ROOTPATH = path.join(basePath, 'env')

      await localstorage.boot(options)
      expect(localstorage.rootPath).to.endWith('env')
    })

    it('prefer config to environment variable', async () => {
      process.env.TYMLY_LOCALSTORAGE_ROOTPATH = '/from/env'

      await localstorage.boot(options)
      expect(localstorage.rootPath).to.endWith('config')
    })

    it('localstorage registers with cloudstorage on boot', async () => {
      let registered = false
      options.bootedServices.cloudstorage.registerProvider =
        provider => { registered = (provider === localstorage) }

      await localstorage.boot(options)

      expect(registered).to.be.true()
    })
  })

  describe('bad boots', () => {
    it('loudly fail if path config is missing', () => {
      delete options.config.localstorage

      return expect(localstorage.boot(options)).to.eventually.be.rejectedWith(/could not configure/i)
    })

    it('fail if configure path is not absolute', () => {
      options.config.localstorage.rootPath = 'relative/path'

      expect(localstorage.boot(options)).to.eventually.be.rejectedWith(/must be absolute/i)
    })

    it('fail if configure path does not exist', () => {
      options.config.localstorage.rootPath = '/a/path/to/nowhere'

      expect(localstorage.boot(options)).to.eventually.be.rejectedWith(/not exist/i)
    })

    it("don't register if config is missing", () => {
      delete options.config.localstorage

      let registered = false
      options.bootedServices.cloudstorage.registerProvider =
        provider => { registered = (provider === localstorage) }

      expect(localstorage.boot(options)).to.eventually.be.rejectedWith(/could not configure/i)
      expect(registered).to.be.false()
    })

    it('loudly fail if cloudstorage is not available', () => {
      delete options.bootedServices.cloudstorage

      expect(localstorage.boot(options)).to.eventually.be.rejectedWith(/can't find cloudstorage/i)
    })

    it("loudly fail if cloudstorage isn't right", () => {
      delete options.bootedServices.cloudstorage.registerProvider

      expect(localstorage.boot(options)).to.eventually.be.rejectedWith(/doesn't have registerProvider/i)
    })
  })
})
