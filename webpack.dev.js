const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getPages = (names, prefix = './src/pages/') => {
  const entry = {}
  names.forEach(name => {
    entry[name] = prefix + name
  })
  return entry
}

module.exports = {
  devtool: 'source-map',
  entry: getPages(['index', 'viewport']),
  output: {
    path: path.resolve(__dirname, './multi-page')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '多页面测试'
    })
  ],
}