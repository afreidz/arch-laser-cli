const fs = require('fs')

module.exports = function (path) {
  return new Promise(resolve => {
    fs.access(path, err => {
      if (err) return resolve('does not exist')
      return resolve('exists')
    })
  })
}
