export default [
  {
    input: 'build/asciidoctor-docbook.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs'
    }
  },
  {
    input: 'build/asciidoctor-docbook.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    }
  },
  {
    input: 'build/asciidoctor-docbook.js',
    output: {
      file: 'dist/index.umd.js',
      name: 'AsciidoctorDocBook',
      format: 'umd'
    }
  }
]
