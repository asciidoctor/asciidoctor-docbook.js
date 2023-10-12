'use strict'

import fs from 'node:fs'
import log from 'bestikk-log'
import bfs from 'bestikk-fs'
import Download from 'bestikk-download'
import { Builder as OpalBuilder } from 'opal-compiler'

const concat = (message, files, destination) => {
  log.debug(message)
  bfs.concatSync(files, destination)
}

const templateFile = function (templateFile, context, outputFile) {
  const template = fs.readFileSync(templateFile, { encoding: 'utf8' })
  const lines = template.split('\n')
  lines.forEach(function (line, index, result) {
    if (line in context) {
      result[index] = context[line]
    }
  })
  const content = lines.join('\n')
  fs.writeFileSync(outputFile, content, 'utf8')
}

const removeDistDirSync = () => {
  log.debug('remove dist directory')
  bfs.removeSync('dist')
  bfs.mkdirsSync('dist')
}

const removeBuildDirSync = () => {
  log.debug('remove build directory')
  bfs.removeSync('build')
  bfs.mkdirsSync('build')
}

const generateUMD = () => {
  log.task('generate UMD')
  const docbookFiles = [
    'build/asciidoctor-docbook5.js'
  ]
  concat('Asciidoctor DocBook 5', docbookFiles, 'build/asciidoctor-docbook.js')
  const asciidoctorDocbookTemplateContext = {
    '//#{asciidoctorDocbookCode}': fs.readFileSync('build/asciidoctor-docbook.js', 'utf8')
  }
  templateFile('src/template-asciidoctor-docbook.js', asciidoctorDocbookTemplateContext, 'build/asciidoctor-docbook.js')
}

const clean = () => {
  log.task('clean')
  removeBuildDirSync()
}

const compile = () => {
  log.task('compile')
  const module = 'docbook5'
  const opalBuilder = OpalBuilder.create()
  opalBuilder.appendPaths('build/asciidoctor/lib')
  opalBuilder.appendPaths('node_modules/opal-compiler/src/stdlib')
  opalBuilder.appendPaths('lib')
  opalBuilder.setCompilerOptions({ dynamic_require_severity: 'ignore' })
  fs.writeFileSync(`build/asciidoctor-${module}.js`, opalBuilder.build(`asciidoctor/converter/${module}`).toString(), 'utf8')
}

export default class Builder {
  constructor () {
    this.asciidoctorCoreVersion = '2.0.20'
    this.download = new Download({})
  }

  async build () {
    if (process.env.SKIP_BUILD) {
      log.info('SKIP_BUILD environment variable is true, skipping "build" task')
      return
    }
    if (process.env.DRY_RUN) {
      log.debug('build')
      return
    }
    const start = process.hrtime()

    try {
      clean()
      await this.downloadDependencies()
      await compile()
      generateUMD()
      removeDistDirSync()
    } catch (e) {
      console.log(e)
      process.exit(1)
    }

    log.success('Done in ' + process.hrtime(start)[0] + 's')
  }

  async downloadDependencies () {
    log.task('download dependencies')
    await this.download.getContentFromURL(`https://codeload.github.com/asciidoctor/asciidoctor/tar.gz/v${this.asciidoctorCoreVersion}`, 'build/asciidoctor.tar.gz')
    await bfs.untar('build/asciidoctor.tar.gz', 'asciidoctor', 'build')
  }
}
