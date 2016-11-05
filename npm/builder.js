module.exports = Builder;

var async = require('async');
var fs = require('fs');
var log = require('bestikk-log');
var bfs = require('bestikk-fs');
var download = require('bestikk-download');
var OpalCompiler = require('bestikk-opal-compiler');

function Builder () {
  this.asciidoctorCoreVersion = '1.5.5';
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
  var builder = this;
  var start = process.hrtime();

  async.series([
    function (callback) { builder.clean(callback); }, // clean
    function (callback) { builder.downloadDependencies(callback); }, // download dependencies
    function (callback) { builder.compile(callback); }, // compile
    function (callback) { builder.generateUMD(callback); }, // generate UMD
    function (callback) { builder.copyToDist(callback); } // copy to dist
  ], function () {
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

  var builder = this;
  async.series([
    function (callback) { download.getContentFromURL('https://codeload.github.com/asciidoctor/asciidoctor/tar.gz/v' + builder.asciidoctorCoreVersion, 'build/asciidoctor.tar.gz', callback); },
    function (callback) { bfs.untar('build/asciidoctor.tar.gz', 'asciidoctor', 'build', callback); }
  ], function () {
    typeof callback === 'function' && callback();
  });
};

Builder.prototype.compile = function (callback) {
  log.task('compile');
  var opalCompiler = new OpalCompiler({dynamicRequireLevel: 'ignore', defaultPaths: ['build/asciidoctor/lib']});
  opalCompiler.compile('asciidoctor/converter/docbook5', 'build/asciidoctor-docbook5.js');
  opalCompiler.compile('asciidoctor/converter/docbook45', 'build/asciidoctor-docbook45.js');
  typeof callback === 'function' && callback();
};

var templateFile = function (templateFile, context, outputFile) {
  var template = fs.readFileSync(templateFile, 'utf8');
  var lines = template.split('\n');
  lines.forEach(function (line, index, result) {
    if (line in context) {
      result[index] = context[line];
    }
  });
  var content = lines.join('\n');
  fs.writeFileSync(outputFile, content, 'utf8');
};

Builder.prototype.generateUMD = function(callback) {
  log.task('generate UMD');

  // DocBook 4.5 + DocBook 5
  var docbookFiles = [
    'build/asciidoctor-docbook45.js',
    'build/asciidoctor-docbook5.js'
  ];
  this.concat('Asciidoctor DocBook 4.5 + 5', docbookFiles, 'build/asciidoctor-docbook.js');
  var asciidoctorDocbookTemplateContext = {
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
  var builder = this;

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
