'use strict'

let fs = require('fs')
let csvWriter = require('csv-write-stream')

const csv = {
  writeCsv: (filePath, headers, elems) => {
    let writer = null
    if (!fs.existsSync(filePath)) {
      headers.push('tstamp')
      writer = csvWriter({headers: headers})
      filePath = `${__dirname}/csv/${Date.now()}.csv`
    } else {
      writer = csvWriter({sendHeaders: false})
    }

    elems['tstamp'] = Date()
    writer.pipe(fs.createWriteStream(filePath, {flags: 'a'}))
    writer.write(elems)
    writer.end()

    return filePath
  }
}

module.exports = csv
