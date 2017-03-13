const path = require('path')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './app.js',

  output: {
    path: __dirname,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        // List the full paths to your entry points here.
        // These files will be treated as entry points by Rollup.
        include: [
          path.join(__dirname, 'src', 'app.js')
        ],
        use: require.resolve('../rollup-loader')
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        // Use CSS modules for local CSS in this example.
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader?modules']
      },
      {
        // And just inject CSS from npm.
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    // Aliases Just Work™.
    alias: {
      webpackConfig: __filename,
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    },
    // jsnext:main is used by Preact.
    mainFields: ['browser', 'module', 'jsnext:main', 'main']
  }
}
