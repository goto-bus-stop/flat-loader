# rollup-webpack-loader

A fancier Rollup loader for Webpack. Imported files will be processed by
Webpack as normal. All ES modules will be bundled by Rollup, and the rest by
Webpack.

## Configuration

If I've done things right, using this loader should be very simple. At the top
of your `module.rules` block in your Webpack config, add this:

```js
{ test: [ /* Full paths to entry files */ ], use: 'rollup-webpack-loader' }
```

It's probably clearer a larger example:

```js
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './app.js',
  module: {
    rules: [
      {
        test: [
          // List the full paths to your application's entry points.
          // In this example we only have src/app.js.
          path.join(__dirname, 'src', 'app.js')
        ],
        // Important: ONLY use `rollup-webpack-loader` here!
        use: 'rollup-webpack-loader'
      },
      // No need to touch your other loader configs.
      ...
    ]
  }
}
```

## How It Works

Your app entry points are passed into Rollup. A custom Rollup plugin is added
that uses Webpack to resolve and load imported modules, so your Webpack resolver
configuration and loaders all apply. ES Modules are bundled by Rollup, and all
other types (UMD/Commonjs/etc) are treated as externals. These will be bundled
by Webpack.

## License

[MIT][]

[MIT]: ./LICENSE
