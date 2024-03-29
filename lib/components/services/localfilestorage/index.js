const dottie = require('dottie')
const path = require('path')
const fs = require('fs')
const fsp = require('fs').promises

class LocalFilestorage {
  async boot (options) {
    this.rootPath_ = configuredRootPath(options)

    const cloudstorage = cloudstorageService(options)
    cloudstorage.registerProvider(this, 'local')

    const { temp } = options.bootedServices
    this.downloadDir = await temp.makeTempDir('download')
  } // boot

  get rootPath () { return this.rootPath_ }

  async ensureFolderPath (folderPath) {
    const rootedPath = this.resolvePath(folderPath)
    if (!rootedPath) throw new Error(`Bad folder path - ${folderPath}`)

    await fsp.mkdir(rootedPath, { recursive: true })
    return {
      folderPath: rootedPath.substring(this.rootPath_.length)
    }
  } // ensureFolderPath

  async listFolderContentsFromPath (folderPath) {
    const rootedPath = this.resolvePath(folderPath)
    if (!rootedPath) return []

    const resolvedFolderPath = rootedPath.substring(this.rootPath_.length)
    try {
      const contents = (await fsp.readdir(rootedPath, { withFileTypes: true }))
        .filter(content => content.isFile() || content.isDirectory())
        .map(content => {
          return {
            Name: content.name,
            Path: path.join(resolvedFolderPath, content.name),
            launches: [
              {
                stateMachineName: 'tymly_downloadFromLocalFileStorage_1_0',
                title: 'Download',
                input: {
                  localFolderPath: this.downloadDir,
                  remoteFilePath: path.join(resolvedFolderPath, content.name)
                }
              }
            ]
          }
        })

      return contents
    } catch (e) {
      if (e.code === 'ENOENT') return [] // path doesn't exist
      throw e
    }
  } // listFolderContentsFromPath

  async deleteFile (folderPath, fileName) {
    const localFilePath = path.join(folderPath, fileName)
    const rootedFilePath = this.resolvePath(localFilePath)

    if (!rootedFilePath) return

    await fsp.unlink(rootedFilePath)
  } // deleteFile

  async copyFileToRemotePath (localFilePath, remoteFolderPath, remoteFileName = null) {
    const localFile = path.resolve(localFilePath)
    const rootedPath = this.resolvePath(remoteFolderPath)

    const fileName = remoteFileName || path.basename(localFile)
    const rootedFileName = path.join(rootedPath, fileName)

    await fsp.copyFile(localFile, rootedFileName)

    return rootedFileName.substring(this.rootPath_.length)
  } // copyFileToRemotePath

  async copyFileToLocalPath (remoteFilePath, localFolderPath) {
    const rootedFilePath = this.resolvePath(remoteFilePath)

    const localFileName = path.join(localFolderPath, path.basename(rootedFilePath))

    await fsp.copyFile(rootedFilePath, localFileName)

    return localFileName
  } // copyFileToLocalPath

  resolvePath (folderPath) {
    const rootedPath = path.join(this.rootPath_, folderPath)

    const isRooted = path.relative(this.rootPath_, rootedPath)
    return !(isRooted.includes('..') || isRooted === '')
      ? rootedPath
      : null
  } // rootPath
} // class LocalFilestorage

function cloudstorageService (options) {
  const cloudstorage = dottie.get(options, 'bootedServices.cloudstorage')

  if (!cloudstorage) bootOops('Can\'t find cloudstorage in bootedServices.')
  if (!cloudstorage.registerProvider) bootOops('cloudstorage doesn\'t have registerProvider method')

  return options.bootedServices.cloudstorage
} // cloudstorageService

function configuredRootPath (options) {
  const configKey = 'config.localstorage.rootPath'
  const fromConfig = dottie.get(options, configKey)
  const fromEnv = process.env.TYMLY_LOCALSTORAGE_ROOTPATH

  const rootPath = fromConfig || fromEnv
  if (!rootPath) bootOops(`Could not configure root path from ${configKey} or TYMLY_LOCALSTORAGE_ROOTPATH.`)
  if (!path.isAbsolute(rootPath)) bootOops('Configured root path is relative. It must be absolute.')
  if (!fs.existsSync(rootPath)) bootOops(`Configured root path does not exist - ${rootPath}`)

  checkAccess(rootPath, fs.constants.R_OK, 'readable')
  checkAccess(rootPath, fs.constants.W_OK, 'writable')

  return rootPath
} // configuredRootPath

function checkAccess (rootPath, flag, actionName) {
  try {
    fs.accessSync(rootPath, flag)
  } catch (e) {
    bootOops(`Configured root path exists but is not ${actionName} - ${rootPath}`)
  }
} // checkAccess

function bootOops (msg) {
  throw new Error(`Can not boot localfilestorage. ${msg}`)
} // bootOops

module.exports = {
  serviceClass: LocalFilestorage,
  bootAfter: ['cloudstorage']
}
