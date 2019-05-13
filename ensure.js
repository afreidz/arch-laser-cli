const os = require('os')
const { exec } = require('child_process')

module.exports = async function (path) {
  await new Promise((resolve, reject) => {
    exec(`sudo npx mkdirp ${path}`, {}, (err, out) => {
      if (err) return reject(err)
      return resolve(out)
    })
  })
  return new Promise((resolve, reject) => {
    exec(`sudo chown -R ${os.userInfo().username} ${path}`, {}, (err, out, serr) => {
      if (err) return reject(err)
      return resolve(true)
    })
  })
}
