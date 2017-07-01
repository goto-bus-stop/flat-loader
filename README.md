# flat-loader

> **Webpack 3 includes the ModuleConcatenationPlugin, which results in similar
> bundles as this loader, but is much better in dealing with split bundles and
> more complex setups. If possible, it's probably best to use that!**

> https://github.com/webpack/webpack/releases/tag/v3.0.0

A fancier Rollup loader for Webpack. This loader uses Rollup for bundling only.

## Install

```bash
npm install --save-dev flat-loader
```

## Configuration

> Note: If you are using Hot Reloading in development, make sure to only apply
> flat-loader in your production build. flat-loader presents all modules that
> are bundled by Rollup to Webpack as a single module, so hot reloading any of
> the bundled modules will force a reload of the entire bundle.

If I've done things right, using this loader should be very simple. At the top
of your `module.rules` block in your Webpack config, add this:

```js
{ include: [ /* Full paths to entry files */ ], use: 'flat-loader' }
```

It's probably clearer in a larger example:

```js
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './app.js',
  module: {
    rules: [
      {
        include: [
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

Your app entry points are passed into Rollup. A [custom Rollup plugin](./webpack-plugin.js)
is added that uses Webpack to resolve and load imported modules, so your Webpack
resolver configuration and loaders all apply. ES Modules are bundled by Rollup,
and all other types (UMD/CommonJS/etc) are treated as externals. These will be
bundled by Webpack.

## License

[MIT][]

[MIT]: ./LICENSE
