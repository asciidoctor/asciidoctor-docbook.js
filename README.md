# DocBook converter for Asciidoctor.js

[![Build](https://github.com/asciidoctor/asciidoctor-docbook.js/actions/workflows/build.yml/badge.svg)](https://github.com/asciidoctor/asciidoctor-docbook.js/actions/workflows/build.yml)
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
import Asciidoctor from '@asciidoctor/core'
import docbookConverter from '@asciidoctor/docbook-converter'

const asciidoctor = Asciidoctor() // instantiate Asciidoctor
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

**❗ IMPORTANT:** Make sure to instantiate Asciidoctor before registering the DocBook converter.

**ℹ️  NOTE:** Since `@asciidoctor/core` is not yet published as an ECMAScript module, you will to use a Web bundler such as Webpack, Rollup or Parcel to import it using the `import` directive.

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
/* global Asciidoctor, AsciidoctorDocBook */
const asciidoctor = Asciidoctor()
AsciidoctorDocBook.register() // register the DocBook converter
```
