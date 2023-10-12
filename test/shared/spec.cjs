/* global it, describe */
const AsciidoctorConvertSpec = async (asciidoctor, expect) => {
  describe('Convert', () => {
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
}

if (typeof module !== 'undefined' && module.exports) {
  // Node.
  module.exports = AsciidoctorConvertSpec
} else {
  globalThis.AsciidoctorConvertSpec = AsciidoctorConvertSpec
}
