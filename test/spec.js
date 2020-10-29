const ospath = require('path')
const asciidoctor = require('@asciidoctor/core')()
require('../dist/index.cjs').register() // Asciidoctor DocBook
const AsciidoctorConvertSpec = require('./shared/spec.js')

const chai = require('chai')
const expect = chai.expect

AsciidoctorConvertSpec(asciidoctor, expect)

describe('Docinfo', () => {
  it('should include a private docinfo header', () => {
    const options = { backend: 'docbook', standalone: true, safe: 'safe', to_file: false }
    const file = ospath.join(__dirname, 'fixtures', 'doc.adoc')
    const xml = asciidoctor.convertFile(file, options)
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
