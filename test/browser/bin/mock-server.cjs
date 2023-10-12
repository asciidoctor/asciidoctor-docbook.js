'use strict'

const portfinder = require('portfinder')
const ServerMock = require('mock-http-server')

let mockServer

process.on('message', (msg) => {
  if (msg.event === 'exit') {
    process.send({ event: 'exiting' })
    process.exit(0)
  } else if (msg.event === 'configure') {
    mockServer.on(msg.data)
  }
})

;(async () => {
  portfinder.basePort = 3000
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    }
    mockServer = new ServerMock({ host: 'localhost', port: port })
    mockServer.start(() => {
      console.log(`Running at http://localhost:${port}`)
      process.send({ event: 'started', port: port });
    })
  })
})()
