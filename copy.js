const ncp = require('ncp')

module.exports = function (src, dest) {
  return new Promise((resolve, reject) => {
    ncp(src, dest, err => {
      if (err) return reject(err)
      return resolve(true)
    })
  })
}
