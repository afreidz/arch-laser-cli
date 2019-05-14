const os = require('os')
const { exec } = require('child_process')

module.exports = async function (src, dest) {
  await new Promise((resolve, reject) => {
    exec(`sudo npx ncp ${src} ${dest}`, {}, (err, out) => {
      if (err) return reject(err)
      return resolve(out)
    })
  })
  return new Promise((resolve, reject) => {
    exec(`sudo chown -R ${os.userInfo().username} ${dest}`, {}, (err, out, serr) => {
      if (err) return reject(err)
      return resolve(true)
    })
  })
}
