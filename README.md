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

const content = `= DocBook
Author Name
v1.0, 2020-04-13
:doctype: book
:doctitle: Awesome Asciidoctor
:docdate: 2020-01-01

== First section

Once upon a time...`

const docbook = asciidoctor.convert(content, { backend: 'docbook5', standalone: true })
//console.log(docbook)
```

### Browser

In the browser, we export a global function named `Asciidoctor.DocBook` to register the DocBook converter.
Once Asciidoctor.js is loaded, you will need to register the converter:

```js
const asciidoctor = Asciidoctor()
Asciidoctor.DocBook() // register the DocBook converter
```

Then, you can use the Asciidoctor.js API to convert AsciiDoc content to DocBook:

```js
const content = `= DocBook
Author Name
v1.0, 2020-04-13
:doctype: book
:doctitle: Awesome Asciidoctor
:docdate: 2020-01-01

== First section

Once upon a time...`

const docbook = asciidoctor.convert(content, { backend: 'docbook5', standalone: true })
//console.log(docbook)
```
