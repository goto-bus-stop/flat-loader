# flat-loader

> Experimental!

A fancier Rollup loader for Webpack. This loader uses Rollup for bundling only.

## Install

```bash
npm install --save-dev flat-loader
```

## Configuration

If I've done things right, using this loader should be very simple. At the top
of your `module.rules` block in your Webpack config, add this:

```js
{ test: [ /* Full paths to entry files */ ], use: 'flat-loader' }
```

It's probably clearer in a larger example:

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
        // Important: ONLY use `flat-loader` here!
        use: 'flat-loader'
      },
      // No need to touch your other loader configs.
      ...
    ]
  }
}
```

You don't need to do any Rollup configuration.

You can see a small example project that uses `flat-loader` in the
[example/](./example) folder.

## How It Works

Your app entry points are passed into Rollup. A [custom Rollup plugin](./webpack-plugin)
is added that uses Webpack to resolve and load imported modules, so your Webpack
resolver configuration and loaders all apply. ES Modules are bundled by Rollup,
and all other types (UMD/CommonJS/etc) are treated as externals. These will be
bundled by Webpack.

## License

[MIT][]

[MIT]: ./LICENSE
