'use strict';
const async = require('async');
const fs = require('fs');
const log = require('bestikk-log');
const bfs = require('bestikk-fs');
const download = require('bestikk-download');
const OpalBuilder = require('opal-compiler').Builder;

function Builder () {
  this.asciidoctorCoreVersion = '1.5.7.1';
}

Builder.prototype.build = function (callback) {
  if (process.env.SKIP_BUILD) {
    log.info('SKIP_BUILD environment variable is true, skipping "build" task');
    callback();
    return;
  }
  if (process.env.DRY_RUN) {
    log.debug('build');
    callback();
    return;
  }
  const builder = this;
  const start = process.hrtime();

  async.series([
    (callback) => builder.clean(callback), // clean
    (callback) => builder.downloadDependencies(callback), // download dependencies
    (callback) => builder.compile(callback), // compile
    (callback) => builder.generateUMD(callback), // generate UMD
    (callback) => builder.copyToDist(callback) // copy to dist
  ], () => {
    log.success('Done in ' + process.hrtime(start)[0] + 's');
    typeof callback === 'function' && callback();
  });
};

Builder.prototype.clean = function (callback) {
  log.task('clean');
  this.removeBuildDirSync(); // remove build directory
  callback();
};

Builder.prototype.removeBuildDirSync = function () {
  log.debug('remove build directory');
  bfs.removeSync('build');
  bfs.mkdirsSync('build');
};

Builder.prototype.downloadDependencies = function (callback) {
  log.task('download dependencies');

  const builder = this;
  async.series([
    (callback) => download.getContentFromURL('https://codeload.github.com/asciidoctor/asciidoctor/tar.gz/v' + builder.asciidoctorCoreVersion, 'build/asciidoctor.tar.gz', callback),
    (callback) => bfs.untar('build/asciidoctor.tar.gz', 'asciidoctor', 'build', callback)
  ], () => {
    typeof callback === 'function' && callback();
  });
};

Builder.prototype.compile = function (callback) {
  log.task('compile');
  ['docbook5', 'docbook45'].forEach((module) => {
    const opalBuilder = OpalBuilder.create();
    opalBuilder.appendPaths('build/asciidoctor/lib');
    opalBuilder.appendPaths('node_modules/opal-compiler/src/stdlib');
    opalBuilder.appendPaths('lib');
    opalBuilder.setCompilerOptions({dynamic_require_severity: 'ignore'});
    fs.writeFileSync(`build/asciidoctor-${module}.js`, opalBuilder.build(`asciidoctor/converter/${module}`).toString(), 'utf8');
  });
  typeof callback === 'function' && callback();
};

const templateFile = function (templateFile, context, outputFile) {
  const template = fs.readFileSync(templateFile, 'utf8');
  const lines = template.split('\n');
  lines.forEach(function (line, index, result) {
    if (line in context) {
      result[index] = context[line];
    }
  });
  const content = lines.join('\n');
  fs.writeFileSync(outputFile, content, 'utf8');
};

Builder.prototype.generateUMD = function (callback) {
  log.task('generate UMD');

  // DocBook 4.5 + DocBook 5
  const docbookFiles = [
    'build/asciidoctor-docbook45.js',
    'build/asciidoctor-docbook5.js'
  ];
  this.concat('Asciidoctor DocBook 4.5 + 5', docbookFiles, 'build/asciidoctor-docbook.js');
  const asciidoctorDocbookTemplateContext = {
    '//#{asciidoctorDocbookCode}': fs.readFileSync('build/asciidoctor-docbook.js', 'utf8')
  };
  templateFile('src/template-asciidoctor-docbook.js', asciidoctorDocbookTemplateContext, 'build/asciidoctor-docbook.js');
  typeof callback === 'function' && callback();
};

Builder.prototype.concat = function (message, files, destination) {
  log.debug(message);
  bfs.concatSync(files, destination);
};

Builder.prototype.copyToDist = function (callback) {
  const builder = this;

  log.task('copy to dist/');
  builder.removeDistDirSync();
  bfs.copySync('build/asciidoctor-docbook.js', 'dist/main.js');
  typeof callback === 'function' && callback();
};

Builder.prototype.removeDistDirSync = function () {
  log.debug('remove dist directory');
  bfs.removeSync('dist');
  bfs.mkdirsSync('dist');
};

module.exports = Builder;
