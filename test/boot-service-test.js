/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const LocalStorageService = require('../lib/components/services/localfilestorage').serviceClass

describe('Boot localstorage service', () => {
  it('localstorage registers with cloudstorage on boot', () => {
    let registered = false
    const localstorage = new LocalStorageService()

    const options = {
      bootedServices: {
        cloudstorage: {
          registerProvider: provider => { registered = (provider === localstorage) }
        }
      }
    }

    localstorage.boot(options)

    expect(registered).to.be.true()
  })
})
