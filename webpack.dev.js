const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ConsoleLogWebpackPlugin = require('./plugin/ConsoleLog')

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
    },
    plugins: [
      new ConsoleLogWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: '多页面测试',
        // chunks:['viewport']
      })
    ],
  },
  {
    name: 'test2',
    mode: 'production',
    entry: getPages(['index']),
    output: {
      path: path.resolve(__dirname, './multi-page-2'),
    },
  }
]