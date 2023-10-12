'use strict'

const fs = require('node:fs')
const childProcess = require('node:child_process')

class MockServer {
  constructor (listener) {
    // we need to use "fork" to spawn a new Node.js process otherwise we will create a deadlock.
    this.childProcess = childProcess.fork(`${__dirname}/bin/mock-server.cjs`)
    if (listener) {
      this.childProcess.on('message', listener)
    }
  }

  async close () {
    return new Promise((resolve, reject) => {
      this.childProcess.on('message', (msg) => {
        if (msg.event === 'exiting') {
          resolve()
        }
      })
      this.childProcess.send({ event: 'exit' })
    })
  }

  registerFiles (files) {
    for (const file of files) {
      const webPath = file.webPath
      const path = file.path
      this.childProcess.send({
        event: 'configure',
        data: {
          method: 'GET',
          path: webPath,
          reply: {
            status: 200,
            headers: { 'content-type': file.mimetype },
            body: fs.readFileSync(path, file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ? 'binary' : 'utf8')
          }
        }
      })
    }
  }
}

module.exports = MockServer
