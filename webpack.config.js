const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js', //打包后的文件名称
    path: path.resolve(__dirname, './dist') //打包后的目录
  },
  module: {
    rules: [ // 转换规则
      {
        test: /\.lazy\.css$/i,
        use: [
          { loader: "style-loader", options: { injectType: "lazyStyleTag" } },
          {loader: "css-loader", options: {modules: true}}
        ],
      },
      {
        test: /\.css$/i,
        exclude: [/\.lazy\.css$/i, /\.link\.css$/i],
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: "body",
              // injectType: 'singletonStyleTag'
            }
          },
          {
            loader: 'css-loader',
            options: {
              exportType: 'array',
              esModule: true,
              modules: {// 开启css-modules模式, 默认值为flase
                localIdentName: '[path][name]__[local]--[hash:base64:5]', //设置css-modules模式下local类名的命名
                // exportLocalsConvention : "camelCase" ,
                // exportGlobals: true,
              },

            }
          }
        ]
      },
      {
        test: /\.link\.css$/i,
        use: [
          { loader: "style-loader", options: { injectType: "linkTag" } },
          { loader: "file-loader",  options: {
              name: "css/[name].[hash:6].css",
              publicPath: "dist1/" // depends on your project architecture
            } },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "image/[name].[hash:6].[ext][query]",
            }
          }
        ]
      }
    ]
  }
}