'use strict'

let fs = require('fs')
let csvWriter = require('csv-write-stream')
let csv = require('csv')

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
  },
  
  parseCsv = (csvFile) => {
    return new Promise(function (resolve, reject) {
      fs.readFile(csvFile, function (err, fileData) {
        if (err) {
          console.log(`Error read:\n {{err}}`)
          reject(err)
        }
        csv.parse(fileData, {relax_column_count: true}, function (err, rows) {
          if (err) {
            console.log(`Error parse:\n {{err}}`)
          }
          // Your CSV data is in an array of arrys passed to this callback as rows.
          // console.log(rows)
          resolve(rows)
        })
      })
    })
  },
  convertRowsToObject: (csvRows) => {
    // the first row is going to the title
    let header = csvRows.shift()
    let elems = csvRows.map((e) => {
      return _.zipObject(header, e)
    })

    return elems
  }
}

module.exports = csv
