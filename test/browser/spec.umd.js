/* global chai, mocha, mochaOpts, testOpts */

// bootstrap
;(async () => {
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

  const asciidoctor = globalThis.Asciidoctor()
  globalThis.AsciidoctorDocBook.register()

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
