const path = require('path')
const rimraf = require('rimraf')

module.exports = function (dir) {
  return new Promise((resolve, reject) => {
    rimraf(path.join(dir, '/*'), err => {
      if (err) return reject(err)
      return resolve(true)
    })
  })
}
