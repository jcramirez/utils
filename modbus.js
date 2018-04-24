const jsmodbus = require('jsmodbus')
let ieee754 = require('ieee754')

/**
 *
*/
function modbus () {
  let self = {}

  /**
   *
   * @param {*} host
   * @param {*} port
   */
  self.connect = (host, port) => {
    return new Promise((resolve, reject) => {
      // create a modbus client
      let client = jsmodbus.client.tcp.complete({
        'host': host,
        'port': port,
        'autoReconnect': true,
        'reconnectTimeout': 1000,
        'timeout': 5000,
        'unitId': 0
      })

      client.connect()

      client.on('connect', function () {
        resolve(client)
      })

      client.on('error', function (err) {
        reject(err)
      })
    })
  }

  /**
   *
   * @param {*} client
   */
  self.close = (client) => {
    client.close()
  }

  /**
   *
   * @param {*} client
   * @param {*} start
   * @param {*} quantity
   */
  self.readInputRegister = (client, start, quantity) => {
    return new Promise((resolve, reject) => {
      // start - 1 to account for offset
      client.readInputRegisters((start - 1), quantity)
        .then(function (resp) {
          // resp will look like { fc: 4, byteCount: 20, register: [ values 0 - 10 ], payload: <Buffer> }
          // console.log(resp)
          resolve(resp.register)
        }, console.error)
    })
  }

  /**
   *
   * @param {*} register
   */
  self.convertRegisterToFloat = (register) => {
    let tmpBuf = []
    // register should be an array of 2 elements (2 16bit nnumbers)
    tmpBuf.push((register[0] & 0xFF00) >> 8)
    tmpBuf.push((register[0] & 0x00FF))

    tmpBuf.push((register[1] & 0xFF00) >> 8)
    tmpBuf.push((register[1] & 0x00FF))

    let tmp = ieee754.read(tmpBuf, 0, false, 23, 4)

    return parseFloat(tmp.toFixed(4))
  }

  return self
}

module.exports = modbus
