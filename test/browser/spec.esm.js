/* global AsciidoctorBrowserSpec, mocha, mochaOpts, testOpts */

import Asciidoctor from '../../node_modules/@asciidoctor/core/dist/browser/asciidoctor.js'
import AsciidoctorDocBook from '../../dist/index.esm.js'

(async () => {
  let reporter
  if (typeof mochaOpts === 'function') {
    const opts = await mochaOpts()
    reporter = opts.reporter
  } else {
    reporter = 'html'
  }
  mocha.setup({
    ui: 'bdd',
    checkLeaks: false,
    reporter: reporter
  })

  const asciidoctor = Asciidoctor()
  AsciidoctorDocBook.register()

  const expect = chai.expect
  await globalThis.AsciidoctorConvertSpec(asciidoctor, expect)

  mocha.run(function (failures) {
    if (failures > 0) {
      console.error('%d failures', failures)
    }
  })
})().catch(err => {
  console.error('Unable to start the browser tests suite: ' + err)
})
