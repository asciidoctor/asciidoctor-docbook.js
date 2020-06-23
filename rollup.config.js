export default [
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs'
    }
  },
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    }
  },
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.umd.js',
      name: 'AsciidoctorDocBook',
      format: 'umd'
    }
  }
]
