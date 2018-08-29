const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');

const config = {
  devProxyUrl: 'http://localhost:3333',
  devProxyMappings: [
    {
      pattern: /optimized\.min\.css/,
      mapTo: '/main.css',
      localAsset: false
    },
    {
      pattern: /optimized\.min\.js/,
      mapTo: '/main.js',
      localAsset: false
    },
    {
      pattern: /assets/,
      mapTo: '/',
      localAsset: true
    }
  ]
};

module.exports = {
  entry: './src/index.js',
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
              sourceMap: true,
              url: false
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
    port: 8080,
    open: true,
    index: '',
    proxy: {
      '/': {
        target: 'http://localhost:3333',
        secure: false,
        bypass: req => {
          let file = false;
          config.devProxyMappings.forEach(element => {
            if (element.pattern.test(req.originalUrl)) {
              console.log(req.originalUrl);
              if (element.localAsset) {
                // map asset's path to local asset
                const filename = req.originalUrl.split('/');
                // file = true;
                glob(filename, options, (er, files) => {
                  console.log(files);
                });
              } else {
                file = element.mapTo || true;
              }
            }
          });
          return file;
        }
      }
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      sourceMap: true
    })
  ]
};
