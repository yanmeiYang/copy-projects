{ bail: true,
  devtool: false,
  entry: { index: [ './src/index.js' ] },
  output:
  { path: '/Users/bogao/develop/aminer/aminer2b/dist',
    filename: '[name].js',
    publicPath: '/',
    libraryTarget: 'var',
    chunkFilename: '[name].async.js' },
  resolve:
  { modules:
    [ '/Users/bogao/develop/aminer/aminer2b/node_modules/roadhog/node_modules',
      '/Users/bogao/develop/aminer/aminer2b/node_modules' ],
      extensions:
    [ '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx' ] },
  resolveLoader:
  { modules:
    [ '/Users/bogao/develop/aminer/aminer2b/node_modules/roadhog/node_modules',
      '/Users/bogao/develop/aminer/aminer2b/node_modules' ],
      moduleExtensions: [ '-loader' ] },
  module:
  { rules:
    [ [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object] ] },
  plugins:
    [ OccurrenceOrderPlugin { preferEntry: undefined },
      DedupePlugin {},
      ExtractTextPlugin { filename: '[name].css', id: 1, options: {} },
      DefinePlugin { definitions: [Object] },
      { apply: [Function: apply] },
  LoaderOptionsPlugin { options: [Object] },
  UglifyJsPlugin { options: [Object] },
  VisualizerPlugin { opts: [Object] } ],
  externals: undefined,
    node: { fs: 'empty', net: 'empty', tls: 'empty' } }
