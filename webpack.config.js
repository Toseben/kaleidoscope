module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  module: {
    loaders: [
      {
        // JavaScript
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader!babel-loader'
      },
      {
        // CSS
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader"},
          { loader: "css-loader", options: { url: false }}
        ]
      },
      {
        // SCSS
        test: /\.scss$/,
        use: [
          { loader: "style-loader"},
          { loader: "css-loader", options: { url: false }},
          { loader: "sass-loader"},
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  }
};
