/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('Boot localstorage service', () => {
  let localstorage
  let options
  const onBoot = () => {
    localstorage.boot(options)
  }

  beforeEach (() => {
    localstorage = new LocalStorageService()

    options = {
      bootedServices: {
        cloudstorage: {
          registerProvider: () => { }
        }
      },
      config: {
        localstorage: {
          rootPath: '/from/config'
        }
      }
    }
  }) // beforeEach

  afterEach (() => {
    delete process.env.TYMLY_LOCALSTORAGE_ROOTPATH
  })

  describe('good boots', () => {
    it('picks up filesystem root directory from config', () => {
      localstorage.boot(options)
      expect(localstorage.rootPath).to.be.a('string')
    })

    it('picks up filesystem root directory from environment', () => {
      delete options.config.localstorage
      process.env.TYMLY_LOCALSTORAGE_ROOTPATH='/from/env'

      localstorage.boot(options)
      expect(localstorage.rootPath).to.eql('/from/env')
    })

    it('prefer config to environment variable', () => {
      process.env.TYMLY_LOCALSTORAGE_ROOTPATH='/from/env'

      localstorage.boot(options)
      expect(localstorage.rootPath).to.eql('/from/config')
    })

    it('localstorage registers with cloudstorage on boot', () => {
      let registered = false
      options.bootedServices.cloudstorage.registerProvider =
        provider => { registered = (provider === localstorage) }

      localstorage.boot(options)

      expect(registered).to.be.true()
    })
  })

  describe('bad boots', () => {
    it ('loudly fail if path config is missing', () => {
      delete options.config.localstorage

      expect(onBoot).to.throw(/could not configure/i)
    })

    it ("don't register if config is missing", () => {
      delete options.config.localstorage

      let registered = false
      options.bootedServices.cloudstorage.registerProvider =
        provider => { registered = (provider === localstorage) }

      expect(onBoot).to.throw(/could not configure/i)
      expect(registered).to.be.false()
    })

    it('loudly fail if cloudstorage is not available', () => {
      delete options.bootedServices.cloudstorage

      expect(onBoot).to.throw(/can't find cloudstorage/i)
    })

    it ("loudly fail if cloudstorage isn't right", () => {
      delete options.bootedServices.cloudstorage.registerProvider

      expect(onBoot).to.throw(/doesn't have registerProvider/i)
    })
  })
})
