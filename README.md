# DocBook converter for Asciidoctor.js

[![Build](https://github.com/asciidoctor/asciidoctor-docbook.js/workflows/Build/badge.svg)](https://github.com/asciidoctor/asciidoctor-docbook.js/actions?query=workflow%3ABuild)
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

It's also possible to use the API to convert AsciiDoc content to DocBook.

#### ESM (import)

ECMAScript modules are the official standard format to package JavaScript code.
We recommend to import this converter using the `import` directive:

```js
import docbookConverter from '@asciidoctor/docbook-converter';

docbookConverter.register() // register the DocBook converter

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

**IMPORTANT:** Make sure that Asciidoctor.js is loaded before registering the DocBook converter. 

#### CommonJS (require)

```js
const asciidoctor = require('@asciidoctor/core')()
const docbookConverter = require('@asciidoctor/docbook-converter')

docbookConverter.register() // register the DocBook converter
```

#### UMD

In addition, we also provide a [Universal Module Definition](https://github.com/umdjs/umd) that exports a global object named `AsciidoctorDocBook`.
Once Asciidoctor.js is loaded, you will need to register the converter using `register`:

```js
const asciidoctor = Asciidoctor()
AsciidoctorDocBook.register() // register the DocBook converter
```
