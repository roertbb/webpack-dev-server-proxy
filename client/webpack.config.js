const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const subpages = ['index', 'test'];
const htmls = subpages.map(
  subpage =>
    new HtmlWebPackPlugin({
      template: `./src/${subpage}.html`,
      filename: `./${subpage}.html`
    })
);

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'optimized.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')()],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    open: true,
    port: 3333
  },
  plugins: [
    ...htmls,
    new MiniCssExtractPlugin({
      filename: 'optimized.min.css',
      chunkFilename: '[id].css',
      sourceMap: true
    })
  ]
};
