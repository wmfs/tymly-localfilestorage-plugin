const dottie = require('dottie')
const path = require('path')
const fs = require('fs')
const fsp = require('fs').promises

class LocalFilestorage {
  boot (options) {
    this.rootPath_ = configuredRootPath(options)

    const cloudstorage = cloudstorageService(options)
    cloudstorage.registerProvider(this)
  } // boot

  get rootPath () { return this.rootPath_ }

  async ensureFolderPath (folderPath) {
    const rootedPath = this.resolvePath(folderPath)
    if (!rootedPath) throw new Error(`Bad folder path - ${folderPath}`)

    await fsp.mkdir(rootedPath, { recursive: true })
  } // ensureFolderPath

  async listFolderContentsFromPath (folderPath) {
    const rootedPath = this.resolvePath(folderPath)
    if (!rootedPath) return []

    try {
      const contents = (await fsp.readdir(rootedPath, {withFileTypes: true}))
        .filter(content => content.isFile() || content.isDirectory())
        .map(content => {
          return {Name: content.name}
        })

      return contents
    } catch (e) {
      if (e.code === 'ENOENT') return [] // path doesn't exist
      throw e
    }
  } // listFolderContentsFromPath

  resolvePath (folderPath) {
    const rootedPath = path.join(this.rootPath_, folderPath)

    const isRooted = path.relative(this.rootPath_, rootedPath)
    return !(isRooted.includes('.') || isRooted === '')
      ? rootedPath
      : null
  } // rootPath
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
  if (!path.isAbsolute(rootPath)) bootOops('Configured root path is relative. It must be absolute.')
  if (!fs.existsSync(rootPath)) bootOops('Configured root path does not exist.')

  checkAccess(rootPath, fs.constants.R_OK, 'readable')
  checkAccess(rootPath, fs.constants.W_OK, 'writable')

  return rootPath
} // configuredRootPath

function checkAccess (rootPath, flag, actionName) {
  try {
    fs.accessSync(rootPath, flag)
  } catch (e) {
    bootOops(`Configured root path exists but is not ${actionName}.`)
  }
} // checkAccess

function bootOops (msg) {
  throw new Error(`Can not boot localfilestorage. ${msg}`)
} // bootOops

module.exports = {
  serviceClass: LocalFilestorage,
  bootAfter: ['cloudstorage']
}
