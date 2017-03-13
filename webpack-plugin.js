const path = require('path')

/**
 * Unique string used to signal that an import should be handled by Webpack and
 * not Rollup.
 */
const EXTERNAL_IDENTIFIER = '\0rollup-webpack-external:'

function patchAddModuleDependenciesOnce (loaderContext) {
  // REALLY BAD!
  // To allow the plugin to load dependencies recursively with
  // loadModule, I force the `recursive` arg to true here.
  // Would perhaps be better to do `addModuleDependencies` manually
  // but idk.
  const compilation = loaderContext._compilation
  const addModuleDependencies = compilation.addModuleDependencies
  compilation.addModuleDependencies = (...args) => {
    args[4] = true // recursive = true
    const result = addModuleDependencies.apply(compilation, args)
    // Remove the override.
    compilation.addModuleDependencies = addModuleDependencies
    return result
  }
}

/**
 * Rollup plugin that uses a Webpack loader context to resolve modules.
 */
module.exports = function webpack (loaderContext) {
  const resolvedModules = {}

  function webpackResolve (importee, importer) {
    return new Promise((resolve, reject) => {
      loaderContext.resolve(path.dirname(importer), importee, (err, result) => {
        if (err) resolve(false)
        else resolve(result)
      })
    })
  }

  function webpackLoadModule (fullPath) {
    return new Promise((resolve, reject) => {
      patchAddModuleDependenciesOnce(loaderContext)
      loaderContext.loadModule(fullPath, (err, code, map, module) => {
        if (err) return reject(err)

        resolve({
          code,
          map,
          module
        })
      })
    })
  }

  return {
    resolveId (importee, importer) {
      // Ignore the entry point
      if (!importer) {
        return
      }

      return webpackResolve(importee, importer).then((fullPath) => {
        if (!fullPath) return fullPath

        const relative = path.relative(loaderContext.context, fullPath)

        return webpackLoadModule(fullPath).then(({ code, map, module }) => {
          // Only include harmony modules.
          if (module.meta.harmonyModule) {
            resolvedModules[fullPath] = { code, map }
            return fullPath
          } else {
            // Keep everything else as `import` statements, marked with
            // an EXTERNAL_IDENTIFIER.
            const nodeModulesRe = /^(\.\.\/)*node_modules\//
            if (nodeModulesRe.test(relative)) {
              return `${EXTERNAL_IDENTIFIER}${importee}`
            } else {
              return `${EXTERNAL_IDENTIFIER}./${relative.replace(/\.js$/, '')}`
            }
          }
        })
      })
    },
    load (target) {
      // Defer to memory plugin for the entry point.
      if (target === loaderContext.resourcePath) {
        return
      }
      // Otherwise return a previously resolved module if there is one.
      return resolvedModules[target]
    },

    transformBundle (source) {
      // Clean up the EXTERNAL_IDENTIFIERs used internally by the plugin, so
      // Webpack can bundle them normally.
      const result = source.replace(
        new RegExp(EXTERNAL_IDENTIFIER, 'g'),
        ''
      )

      return result
    }
  }
}

module.exports.EXTERNAL_IDENTIFIER = EXTERNAL_IDENTIFIER
