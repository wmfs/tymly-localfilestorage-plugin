const dottie = require('dottie')

class LocalFilestorage {
  boot (options) {
    this.rootPath_ = configuredRootPath(options)

    const cloudstorage = cloudstorageService(options)
    cloudstorage.registerProvider(this)
  } // boot

  get rootPath() { return this.rootPath_ }
} // class LocalFilestorage

function cloudstorageService (options) {
  const cloudstorage = dottie.get(options, 'bootedServices.cloudstorage')

  if (!cloudstorage) bootOops("Can't find cloudstorage in bootedServices.")
  if (!cloudstorage.registerProvider) bootOops("cloudstorage doesn't have registerProvider method")

  return options.bootedServices.cloudstorage
} // cloudstorageService

function configuredRootPath (options) {
  const configKey = 'config.localstorage.rootPath'
  const fromConfig = dottie.get(options, configKey)
  const fromEnv = process.env.TYMLY_LOCALSTORAGE_ROOTPATH

  const rootPath = fromConfig || fromEnv
  if (!rootPath) bootOops(`Could not configure root path from ${configKey} or TYMLY_LOCALSTORAGE_ROOTPATH.`)
  return rootPath
} // configuredRootPath

function bootOops (msg) {
  throw new Error(`Can not boot localfilestorage. ${msg}`)
} // bootOops

module.exports = {
  serviceClass: LocalFilestorage,
  bootAfter: ['cloudstorage']
}
