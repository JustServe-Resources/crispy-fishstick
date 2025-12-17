const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: 'main.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/mock.js', to: path.join(__dirname, 'dist/assets') },
      ],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: path.join(__dirname, 'dist/') },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/index.html',
      filename: './index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/assets')
    },
    compress: true,
    port: 8080
  }
};