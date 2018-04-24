'use strict'

const winston = require('winston')
const Rotate = require('winston-logrotate').Rotate
const path = require('path')

const logDir = path.join(__dirname, 'logs')
// const tsFormat = () => { return new Date() }

const logger = {
  modbusLogger: new (winston.Logger)({
    transports: [
      new Rotate({
        file: `${logDir}/modbusLogger.log`,
        colorize: true,
        timestamp: true,
        json: false,
        max: '100m',
        keep: 5,
        compress: true
      })
    ]
  })
}

module.exports = logger
