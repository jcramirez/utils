'use strict'


let ieee754 = require('ieee754')

function utils () {
  let self = {}

  self.convertFloatTo754 = (val) => {
    let buffer = []
    ieee754.write(buffer, val, 0, false, 23, 4)

    return buffer
  }

  self.convert754ToFloat = (val) => {
    let tmp = ieee754.read(val, 0, false, 23, 4)

    return parseFloat(tmp.toFixed(4))
  }

  /**
 *
 * @param {*} arr
 */
  self.convertHexArrayToString = (arr) => {
    let res = ''
    for (let i = 0; i < arr.length; i++) {
      let element = arr[i].toString(16).toUpperCase()

      if (element.length < 2) {
        element = '0' + element
      }

      res += element
    }

    return res
  }

  self.packString = (str) => {
    let fourBytes = []
    let shifts = [
      {
        mask: 0xFC0000,
        shift: 18
      },
      {
        mask: 0x3F000,
        shift: 12
      },
      {
        mask: 0xFC0,
        shift: 6
      },
      {
        mask: 0x3F,
        shift: 0
      }
    ]
    let packed = []
    let combined = 0

    for (let i = 0; i < str.length; i++) {
      let element = str[i].charCodeAt(0)

      if (element >= 0x40 && element <= 0x5F) {
        element = element - 0x40
      }

      // get rid of the bits we wont pack anyway
      element = element & 0x3F

      // collect 4 bytes to pack into 3 bytes

      fourBytes.push(element)

      if (fourBytes.length === 4) {
        for (let x = 0; x < fourBytes.length; x++) {
          const byte = fourBytes[x]

          combined |= (byte << shifts[x].shift)
        }

        packed.push((combined >> 16) & 0xFF)
        packed.push((combined >> 8) & 0xFF)
        packed.push((combined) & 0xFF)

        // reset it all
        fourBytes = []
        combined = 0
      }
    }

    return packed
  }

  // THESE BELOW ARE ALL RELATED TO PARSING HART COMMANDS se hartParser.js

  /**
  *
  * @param {*} val
  */
  self.intToHex = (val, numBytes) => {
    let tmp = val.toString(16)

    // do we need to add zeros?
    if (tmp.length < (numBytes * 2)) {
      // add zeros
      let tmpCount = ((numBytes * 2) - tmp.length)
      for (let i = 0; i < tmpCount; i++) {
        tmp = '0' + tmp
      }
    }
    return '0x' + tmp.toUpperCase()
  }

  /**
   * [getLatinFromBuffer description]
   * @param  {[type]} longTagBuf [description]
   * @return {[type]}            [description]
   */
  self.getLatinFromBuffer = (longTagBuf, numBytes) => {
    longTagBuf = Buffer.from(longTagBuf)
    let tmp = longTagBuf.filter(Number).toString('utf8').trim()
    return tmp
  }

  /**
   *
   * @param {*} val
   * @param {*} numBytes
   */
  self.convert754ToFloat = (val, numBytes) => {
    let tmp = ieee754.read(val, 0, false, 23, 4)

    return parseFloat(tmp.toFixed(4))
  }

  /**
   *
   * @param {*} str
   */
  self.unpack = (str, numBytes) => {
    let fourChars = []
    let chars = []
    let shifts = [
      {
        mask: 0xFC0000,
        shift: 18
      },
      {
        mask: 0x3F000,
        shift: 12
      },
      {
        mask: 0xFC0,
        shift: 6
      },
      {
        mask: 0x3F,
        shift: 0
      }
    ]

    for (let i = 0; i < str.length; i++) {
      const elem = str[i]
      fourChars.push(elem)
      if (i !== 0 && fourChars.length % 3 === 0) {
        // we got four chars
        let combined = (fourChars[0] << 16) | (fourChars[1] << 8) | (fourChars[2])

        for (let x = 0; x < 4; x++) {
          let tmp = (combined & shifts[x].mask) >> shifts[x].shift

          if (tmp >= 0 && tmp <= 0x1F) {
            tmp = tmp + 0x40
          }

          tmp = String.fromCharCode(tmp)

          chars.push(tmp)
          fourChars = []
        }
      }
    }
    return chars.join('')
  }
  // END OF RELATED TO PARSING HART COMMANDS se hartParser.js

  return self
}

module.exports = utils
