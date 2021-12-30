const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ConsoleLogWebpackPlugin = require('./sWebpack/plugin/ConsoleLog')
const svgToMiniDataURI = require('mini-svg-data-uri');

const getPages = (names, prefix = './src/pages/') => {
  const entry = {}
  names.forEach(name => {
    entry[name] = prefix + name
  })
  return entry
}

module.exports = [
  {
    name: 'test1',
    mode: 'development',
    devtool: 'source-map',
    entry: getPages(['index', 'viewport']),
    output: {
      path: path.resolve(__dirname, './multi-page'),
      // assetModuleFilename: 'images/[name][ext][query]'
    },
    plugins: [
      new ConsoleLogWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'index',
        template: "./public/index.html",
        filename: 'index.html',
        chunks: ['index']
      }),
      new HtmlWebpackPlugin({
        title: 'viewport',
        template: "./public/index.html",
        filename: 'viewport.html',
        chunks: ['viewport']
      })
    ],
    module: {
      rules: [
        {
          test: /\.png/,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name][hash][ext][query]'
          }
        },
        {
          test: /\.svg/,
          type: 'asset/inline',
          generator: {
            dataUrl: content => {
              content = content.toString();
              return svgToMiniDataURI(content);
            }
          }
        },
        {
          test: /(\.txt|\.md)/,
          type: 'asset/source',
        }
      ]
    }
  }
]