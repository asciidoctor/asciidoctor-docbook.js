module.exports.configure = (mockServer) => {
  const rootRelativeFile = (file) => {
    const webPath = file.path
      .replace(/\.\./g, '')
      .replace(/\/\//g, '/')
    return {
      webPath: webPath.startsWith('/') ? webPath : `/${webPath}`,
      path: `${__dirname}/${file.path}`,
      mimetype: file.mimetype
    }
  }
  const files = [
    {
      webPath: '/index.esm.html',
      path: `${__dirname}/index.esm.html`,
      mimetype: 'text/html'
    },
    {
      webPath: '/index.umd.html',
      path: `${__dirname}/index.umd.html`,
      mimetype: 'text/html'
    }
  ]
  files.push(rootRelativeFile({
    path: '../../node_modules/mocha/mocha.js',
    mimetype: 'application/javascript'
  }))
  files.push(rootRelativeFile({
    path: '../../node_modules/@asciidoctor/core/dist/browser/asciidoctor.js',
    mimetype: 'application/javascript'
  }))
  files.push(rootRelativeFile({
    path: '../../node_modules/mocha/mocha.css',
    mimetype: 'text/plain'
  }))
  files.push(rootRelativeFile({
    path: '../../node_modules/chai/chai.js',
    mimetype: 'application/javascript'
  }))
  files.push(rootRelativeFile({
    path: '../../node_modules/dirty-chai/lib/dirty-chai.js',
    mimetype: 'application/javascript'
  }))
  files.push(rootRelativeFile({
    path: '../shared/spec.js',
    mimetype: 'application/javascript'
  }))
  files.push({
    path: `${__dirname}/spec.esm.js`,
    webPath: '/spec.esm.js',
    mimetype: 'application/javascript'
  })
  files.push({
    path: `${__dirname}/spec.umd.js`,
    webPath: '/spec.umd.js',
    mimetype: 'application/javascript'
  })
  files.push(rootRelativeFile({
    path: '../../dist/index.umd.js',
    mimetype: 'application/javascript'
  }))
  files.push(rootRelativeFile({
    path: '../../dist/index.esm.js',
    mimetype: 'application/javascript'
  }))
  mockServer.registerFiles(files)
}
