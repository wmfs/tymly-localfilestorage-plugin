/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('Boot localstorage service', () => {
  let localstorage
  let options
  const onBoot = () => { localstorage.boot(options) }

  beforeEach (() => {
    console.log('yes')

    localstorage = new LocalStorageService()

    options = {
      bootedServices: {
        cloudstorage: {
          registerProvider: () => { }
        }
      }
    }
  })

  describe('good boots', () => {
    it('localstorage registers with cloudstorage on boot', () => {
      let registered = false
      options.bootedServices.cloudstorage.registerProvider =
        provider => { registered = (provider === localstorage) }

      localstorage.boot(options)
      expect(registered).to.be.true()
    })

    it('picks up filesystem root directory from config', () => {
      localstorage.boot(options)
      expect(localstorage.rootPath).to.be.a('string')
    })

    it('picks up filesystem root directory from environment', () => {
      localstorage.boot(options)
      expect(localstorage.rootPath).to.be.a('string')
    })
  })

  describe('bad boots', () => {
    it('loudly fail if cloudstorage is not available', () => {
      delete options.bootedServices.cloudstorage

      expect(onBoot).to.throw(/can not register/i)
    })

    it ("loudly fail if cloudstorage isn't right", () => {
      delete options.bootedServices.cloudstorage.registerProvider

      expect(onBoot).to.throw(/can not register/i)
    })

    it ('loudly fail if path config is missing', () => {
      expect(onBoot).to.throw(/missing config/i)
    })
  })
})
