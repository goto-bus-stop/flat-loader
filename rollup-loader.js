const rollup = require('rollup').rollup
const webpack = require('./webpack-plugin')

module.exports = function (contents, map) {
  const loader = this
  const cb = loader.async()

  rollup({
    entry: loader.resourcePath,
    external (id) {
      return id.startsWith(webpack.EXTERNAL_IDENTIFIER)
    },
    onwarn (warning) {
      // Ignore warnings about treating things as externals, but emit a Webpack
      // warning for everything else.
      if (warning.code !== 'UNRESOLVED_IMPORT') {
        loader.emitWarning(warning.message)
      }
    },
    plugins: [
      {
        // Read the entry file from memory.
        load(target) {
          if (target === loader.resourcePath) {
            return contents
          }
        }
      },
      webpack(loader)
    ]
  }).then((bundle) => {
    // Send compiled code back to webpack.
    const result = bundle.generate({ format: 'es' })

    cb(null, result.code, result.map)
  }).catch(cb)
}