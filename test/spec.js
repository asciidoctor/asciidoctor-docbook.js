const asciidoctor = require('@asciidoctor/core')()
require('../dist/main.js').register() // Asciidoctor DocBook
const chai = require('chai')
const expect = chai.expect

describe('Rendering', () => {
  it('should not produce a docbook45 document when backend=docbook45', () => {
    const options = { attributes: ['backend=docbook45', 'doctype=book'], header_footer: true }
    expect(() => asciidoctor.convert(`:doctitle: DocTitle
:docdate: 2014-01-01
== Test`, options)).to.throw()
  })

  it('should produce a docbook5 document when backend=docbook5', () => {
    const options = { attributes: { backend: 'docbook5', doctype: 'book' }, standalone: true }
    const html = asciidoctor.convert(`:doctitle: DocTitle
:docdate: 2014-01-01
== Test`, options)
    expect(html).to.equal(`<?xml version="1.0" encoding="UTF-8"?>
<?asciidoc-toc?>
<?asciidoc-numbered?>
<book xmlns="http://docbook.org/ns/docbook" xmlns:xl="http://www.w3.org/1999/xlink" version="5.0" xml:lang="en">
<info>
<title>DocTitle</title>
<date>2014-01-01</date>
</info>
<chapter xml:id="_test">
<title>Test</title>

</chapter>
</book>`)
  })
})

describe('Docinfo', () => {
  it('should include a private docinfo header', () => {
    const options = { backend: 'docbook', standalone: true, safe: 'safe', to_file: false }
    const xml = asciidoctor.convertFile(`${__dirname}/fixtures/doc.adoc`, options)
    expect(xml).to.equal(`<?xml version="1.0" encoding="UTF-8"?>
<?asciidoc-toc?>
<?asciidoc-numbered?>
<book xmlns="http://docbook.org/ns/docbook" xmlns:xl="http://www.w3.org/1999/xlink" version="5.0" xml:lang="en">
<info>
<title>Document Title</title>
<date>2020-04-13</date>
<author>
<personname>
<firstname>Author</firstname>
<surname>Name</surname>
</personname>
</author>
<authorinitials>AN</authorinitials>
<revhistory>
<revision>
<revnumber>1.0</revnumber>
<date>2020-04-13</date>
<authorinitials>AN</authorinitials>
</revision>
</revhistory>
<edition>1.0</edition>
</info>
<preface>
<title></title>
<simpara>This is a sample document.</simpara>
</preface>
</book>`)
  })
})
