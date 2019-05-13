const fs = require('fs')

module.exports = function (path) {
  return new Promise(resolve => {
    try {
      fs.accessSync(path)
      return true
    } catch (err) {
      return false
    }
  })
}
