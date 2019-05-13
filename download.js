const os = require('os')
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const fetch = require('node-fetch')
const tempDir = path.join(os.homedir(), 'tmp', 'arch-laser')

module.exports = async function () {
  let response = await fetch('https://github.com/afreidz/arch-laser/archive/master.zip')
  await new Promise((resolve, reject) => {
    let writeStream = fs.createWriteStream(path.join(tempDir, 'master.zip'))
    response.body.pipe(writeStream)
    response.body.on('error', reject)
    writeStream.on('finish', resolve)
  })

  let zip = new AdmZip(path.join(tempDir, 'master.zip'))

  zip.extractEntryTo('arch-laser-master/awesome/', tempDir)
  zip.extractEntryTo('arch-laser-master/gtk-3.0/', tempDir)
  zip.extractEntryTo('arch-laser-master/rofi/', tempDir)
  zip.extractEntryTo('arch-laser-master/termite/', tempDir)
  zip.extractEntryTo('arch-laser-master/slim/', tempDir)
}
