'use strict'

const fs = require('fs')

/**
 *
 */
function persistentConfig () {
  let self = {}
  let configFile = null
  let PATH_OF_CONFIG_FILE = null

  /**
   * pathToConfigFile where the default config file you want exists
   * usually we create the initial configurations you need
   */
  self.initConfigObject = (pathToConfigFile) => {
    PATH_OF_CONFIG_FILE = `${process.cwd()}${pathToConfigFile}`
    if (fs.existsSync(PATH_OF_CONFIG_FILE)) {
      console.log('file found: ' + PATH_OF_CONFIG_FILE)
      console.log(`cwd: ${process.cwd()}`)
      configFile = require(PATH_OF_CONFIG_FILE)
    } else {
      configFile = require(`.${pathToConfigFile}`)
      fs.writeFile(PATH_OF_CONFIG_FILE, JSON.stringify(configFile), 'utf8', function (err) {
        if (err) {
          return console.log(err)
        }
      })
      // fs.writeFileSync(PATH_OF_CONFIG_FILE, JSON.stringify(configFile), 'utf8')
    }

    // return JSON.stringify(configFile)
  }

  /**
   *
   */
  self.getConfigObject = () => {
    return configFile
  }

  /**
   *
   */
  self.saveConfigObj = (file) => {
    fs.writeFileSync(PATH_OF_CONFIG_FILE, JSON.stringify(file), 'utf8')
  }

  return self
}

module.exports = persistentConfig
