/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('Boot localstorage service', () => {
  let localstorage
  let options =

  beforeEach (() => {
    localstorage = new LocalStorageService()

    options = {
      bootedServices: {
        cloudstorage: {
        }
      }
    }
  })

  it('localstorage registers with cloudstorage on boot', () => {
    let registered = false
    options.bootedServices.cloudstorage.registerProvider =
        provider => { registered = (provider === localstorage) }

    localstorage.boot(options)
    expect(registered).to.be.true()
  })

  it('loudly fail if cloudstorage is not available', () => {
    delete options.bootedServices.cloudstorage
    const onBoot = () => { localstorage.boot(options) }

    expect(onBoot).to.throw(/can not register/i)
  })

  it ("loudly fail if cloudstorage isn't right", () => {
    const onBoot = () => { localstorage.boot(options) }

    expect(onBoot).to.throw(/can not register/i)
  })
})
