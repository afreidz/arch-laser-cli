#! /usr/bin/env node
const os = require('os')
const path = require('path')
const Listr = require('listr')
const copy = require('./copy')
const clean = require('./clean')
const ensure = require('./ensure')
const exists = require('./exists')
const download = require('./download')
const { exec } = require('child_process')
const configDir = path.join(os.homedir(), '.config')
const tempDir = path.join(os.homedir(), 'tmp', 'arch-laser')

;(async function () {
  // Awesome theme
  let awesomeGit = path.join(tempDir, 'arch-laser-master/awesome')
  let awesomeDir = path.join(configDir, 'awesome')
  let awesomeThemeGit = path.join(awesomeGit, 'themes')
  let awesomeThemeDir = path.join(awesomeDir, 'themes')

  // GTK Config
  let gtkGit = path.join(tempDir, 'arch-laser-master/gtk-3.0')
  let gtkDir = path.join(configDir, 'gtk-3.0')

  // Rofi Config
  let rofiGit = path.join(tempDir, 'arch-laser-master/rofi')
  let rofiDir = path.join(configDir, 'rofi')

  // Termite Config
  let termiteGit = path.join(tempDir, 'arch-laser-master/termite')
  let termiteDir = path.join(configDir, 'termite')

  // Slim Theme
  let slimGit = path.join(tempDir, 'arch-laser-master/slim')
  let slimDir = os.platform() === 'darwin'
    ? path.join(path.resolve('/'), 'usr/local/slim')
    : path.join(path.resolve('/'), 'usr/share/slim')
  let slimThemeDir = path.join(slimDir, 'themes')

  const tasks = new Listr([{
    title: 'Ensure .config directory exists',
    task: async () => {
      await ensure(configDir)
    }
  }, {
    title: 'Ensure temp directory exists',
    task: async () => {
      await ensure(tempDir)
    }
  }, {
    title: 'Clear temp directory',
    task: async () => {
      await clean(tempDir)
    }
  }, {
    title: 'Download latest master of Arch Laser Theme',
    task: async () => {
      await download()
    }
  }, {
    title: 'Installing AwesomeWM theme',
    task: async () => {
      return new Listr([{
        title: 'Ensure theme directory exists',
        task: async () => {
          await ensure(awesomeThemeDir)
        }
      }, {
        title: 'Backup rc.lua',
        enabled: async () => {
          let result = await exists(path.join(awesomeDir, 'rc.lua'))
          return result === 'exists'
        },
        task: async () => {
          await await copy(path.join(awesomeDir, 'rc.lua'), path.join(awesomeDir, 'rc.lua.back'), { overwrite: true })
        }
      }, {
        title: 'Copying AwesomeWM theme files',
        task: async () => {
          await copy(path.join(awesomeGit, 'rc.lua'), path.join(awesomeDir, 'rc.lua'), { overwrite: true })
          await copy(path.join(awesomeThemeGit, 'laser'), path.join(awesomeThemeDir, 'laser'), { overwrite: true })
        }
      }])
    }
  }, {
    title: 'Installing GTK confi',
    task: () => {
      return new Listr([{
        title: 'Ensuring GTK config directory exists',
        task: async () => {
          await ensure(gtkDir)
        }
      }, {
        title: 'Backup existing GTK config',
        enabled: async () => {
          let result = await exists(path.join(gtkDir, 'gtk.css'))
          return result === 'exists'
        },
        task: async () => {
          await copy(path.join(gtkDir, 'gtk.css'), path.join(gtkDir, 'gtk.css.backup'), { overwrite: true })
        }
      }, {
        title: 'Copying GTK theme files',
        task: async () => {
          await copy(path.join(gtkGit, 'gtk.css'), path.join(gtkDir, 'gtk.css'), { overwrite: true })
        }
      }])
    }
  }, {
    title: 'Installing Rofi Theme',
    task: () => {
      return new Listr([{
        title: 'Ensure Rofi config directory exists',
        task: async () => {
          await ensure(rofiDir)
        }
      }, {
        title: 'Backup existing Rofi config',
        enabled: async () => {
          let result = await exists(path.join(rofiDir, 'config'))
          return result === 'exists'
        },
        task: async () => {
          await copy(path.join(rofiDir, 'config'), path.join(rofiDir, 'config.backup'), { overwrite: true })
        }
      }, {
        title: 'Copying Rofi config',
        task: async () => {
          await copy(path.join(rofiGit, 'config'), path.join(rofiDir, 'config'), { overwrite: true })
        }
      }])
    }
  }, {
    title: 'Installing Termite config',
    task: () => {
      return new Listr([{
        title: 'Ensure Termite config directory exists',
        task: async () => {
          await ensure(termiteDir)
        }
      }, {
        title: 'Backup existing Termite config',
        enabled: async () => {
          let result = await exists(path.join(termiteDir, 'config'))
          return result === 'exists'
        },
        task: async () => {
          await copy(path.join(termiteDir, 'config'), path.join(termiteDir, 'config.backup'), { overwrite: true })
        }
      }, {
        title: 'Copying Termite config',
        task: async () => {
          await copy(path.join(termiteGit, 'config'), path.join(termiteDir, 'config'), { overwrite: true })
        }
      }])
    }
  }, {
    title: 'Installing SLIM theme',
    task: () => {
      return new Listr([{
        title: 'Ensure slim theme directory exists',
        task: async () => {
          await ensure(slimThemeDir)
        }
      }, {
        title: 'Copying SLIM theme',
        task: async () => {
          await copy(path.join(slimGit, 'laser'), path.join(slimThemeDir, 'laser'), { overwrite: true })
        }
      }])
    }
  }, {
    title: 'Cleanup',
    task: async () => {
      await clean(tempDir)
    }
  }])

  console.log('Sudo may be required for some of these commands. Please enter your sudo password if prompted')
  exec('sudo echo "done."', {}, (err, out) => {
    if (!err) tasks.run().catch(console.error)
  })
})()
