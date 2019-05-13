const fs = require('fs')

module.exports = function (path) {
  return new Promise(resolve => {
    fs.access(path, fs.F_OK, err => {
      if (err) return resolve(false)
      return resolve(true)
    })
  })
}
