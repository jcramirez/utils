'use strict'

let mosca = require('mosca')

function mqqtBroker (port) {
  let settings = {
    port: port
    // backend: ascoltatore
  }

  let server = new mosca.Server(settings)

  server.on('clientConnected', function (client) {
    console.log('client connected', client.id)
  })

  // fired when a client disconnects
  server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id)
  })

  // fired when a message is received
  server.on('published', function (packet, client) {
    // console.log('Published')
    // console.log('Published', packet.payload)
  })

  server.on('ready', () => {
    console.log('Mosca server is up and running')
  })

  /**
   *
   * @param {*} topic
   * @param {*} data
   */
  function publish (topic, data) {
    var message = {
      topic: topic,
      payload: data, // or a Buffer
      qos: 0, // 0, 1, or 2
      retain: false // or true
    }

    server.publish(message, function () {
      // console.log('done!')
    })
  }

  /**
   *
   * @param {*} topic
   * @param {*} data
   */
  function publishAsync (topic, data) {
    return new Promise((resolve, reject) => {
      var message = {
        topic: topic,
        payload: data, // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
      }

      server.publish(message, function () {
        // console.log('done!')
        resolve()
      })
    })
  }

  return {
    publish: publish,
    publishAsync: publishAsync
  }
}

module.exports = mqqtBroker
