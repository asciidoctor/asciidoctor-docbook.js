import * as url from 'node:url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default [
  {
    input: `${__dirname}/spec.esm.js`,
    output: {
      file: `${__dirname}/spec.umd.js`,
      name: 'AsciidoctorDocBookSpec',
      format: 'umd'
    }
  },
]
