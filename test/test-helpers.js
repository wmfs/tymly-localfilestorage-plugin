const path = require('path')
const fs = require('fs')

function tearDownDirectories (dirPath, root) {
  if (!fs.existsSync(dirPath)) return

  const files = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(f => f.isFile())
    .map(f => path.join(dirPath, f.name))
    .forEach(f => fs.unlinkSync(f))

  const cleanUp = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(dirPath, d.name))
  cleanUp.forEach(dir => tearDownDirectories(dir, dirPath))
  cleanUp.forEach(dir => fs.rmdirSync(dir))

  if (!root) fs.rmdirSync(dirPath)
}

module.exports = {
  tearDownDirectories
}
