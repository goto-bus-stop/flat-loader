const rollup = require('rollup').rollup
const memory = require('rollup-plugin-memory')
const webpack = require('./webpack-plugin')

module.exports = function (contents, map) {
  const loader = this
  const cb = loader.async()

  rollup({
    entry: {
      path: loader.resourcePath,
      contents: contents
    },
    external (id) {
      return id.startsWith(webpack.EXTERNAL_IDENTIFIER)
    },
    onwarn () {
      // Ignore warnings about externals etc.
    },
    plugins: [
      // Read the entry file from memory.
      memory(),
      webpack(loader)
    ]
  }).then((bundle) => {
    // Send compiled code back to webpack.
    const result = bundle.generate({ format: 'es' })

    cb(null, result.code, result.map)
  }).catch(cb)
}