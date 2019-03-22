'use strict'

let ieee754 = require('ieee754')

function convert754ToFloat (val) {
  let tmp = ieee754.read(val, 0, false, 23, 4)

  return parseFloat(tmp.toFixed(4))
}

function convertFloatTo754 (val) {
let buffer = []
  let tmp = ieee754.write (buffer, val, 0, false, 23, 4)

  return buffer
}
