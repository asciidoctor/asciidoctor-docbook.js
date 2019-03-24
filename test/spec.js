var asciidoctor = require('@asciidoctor/core')();
require('../dist/main.js')(); // Asciidoctor DocBook
var assert = require('assert');

describe('Rendering', function () {

  it('should not produce a docbook45 document when backend=docbook45', function () {
    var options = {attributes: ['backend=docbook45', 'doctype=book'], header_footer: true};

    assert.throws(() => {
      asciidoctor.convert(':doctitle: DocTitle\n:docdate: 2014-01-01\n== Test', options);
    });
  });

  it('should produce a docbook5 document when backend=docbook5', function () {
    var options = {attributes: ['backend=docbook5', 'doctype=book'], header_footer: true};
    var html = asciidoctor.convert(':doctitle: DocTitle\n:docdate: 2014-01-01\n== Test', options);
    assert.equal(html, '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<?asciidoc-toc?>\n' +
'<?asciidoc-numbered?>\n' +
'<book xmlns="http://docbook.org/ns/docbook" xmlns:xl="http://www.w3.org/1999/xlink" version="5.0" xml:lang="en">\n' +
'<info>\n' +
'<title>DocTitle</title>\n' +
'<date>2014-01-01</date>\n' +
'</info>\n' +
'<chapter xml:id="_test">\n' +
'<title>Test</title>\n' +
'\n' +
'</chapter>\n' +
'</book>');
  });
});
