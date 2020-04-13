# DocBook converter for Asciidoctor.js

[![Travis build status](http://img.shields.io/travis/asciidoctor/asciidoctor-docbook.js.svg)](https://travis-ci.org/asciidoctor/asciidoctor-docbook.js)
[![npm version](http://img.shields.io/npm/v/@asciidoctor/docbook-converter.svg)](https://www.npmjs.com/package/@asciidoctor/docbook-converter)

## Install

```sh
$ npm i @asciidoctor/core @asciidoctor/docbook-converter
```

## Usage

### CLI

If you are using the [Asciidoctor.js CLI](https://github.com/asciidoctor/asciidoctor-cli.js) then you can use the `--require` option to load the DocBook converter:

```
$ asciidoctor --require @asciidoctor/docbook-converter --backend docbook doc.adoc
```

The above command will generate a file named _doc.xml_ using the DocBook converter.

### API

It's also possible to use the API to convert AsciiDoc content to DocBook:

```javascript
var asciidoctor = require('@asciidoctor/core')()
require('@asciidoctor/docbook-converter')()

const options = {
  attributes: { backend: 'docbook5', doctype: 'book' },
  standalone: true
}

const content = `= DocBook
:doctitle: Awesome Asciidoctor
:docdate: 2020-01-01


== First section

Once upon a time...`

const docbook = asciidoctor.convert(content, options)
//console.log(docbook)
```
