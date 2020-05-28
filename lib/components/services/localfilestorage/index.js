class LocalFilestorage {
  boot (options) {
    const cloudstorage = cloudstorageService(options)
    cloudstorage.registerProvider(this)
  }
} // class LocalFilestorage

function cloudstorageService (options) {
  return options.bootedServices.cloudstorage
} // cloudstorageService

module.exports = {
  serviceClass: LocalFilestorage,
  bootAfter: ['cloudstorage']
}
