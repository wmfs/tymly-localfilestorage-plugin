const dottie = require('dottie')

class LocalFilestorage {
  boot (options) {
    const cloudstorage = cloudstorageService(options)
    cloudstorage.registerProvider(this)
  }
} // class LocalFilestorage

function cloudstorageService (options) {
  const cloudstorage = dottie.get(options, 'bootedServices.cloudstorage')

  if (!cloudstorage) bootOops("Can't find cloudstorage in bootedServices.")
  if (!cloudstorage.registerProvider) bootOops("cloudstorage doesn't have registerProvider method")

  return options.bootedServices.cloudstorage
} // cloudstorageService

function bootOops (msg) {
  throw new Error(`Can not register localfilestorage. ${msg}`)
} // bootOops

module.exports = {
  serviceClass: LocalFilestorage,
  bootAfter: ['cloudstorage']
}
