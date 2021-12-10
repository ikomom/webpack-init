const path = require('path')

module.exports = {
    devtool: 'source-map',
    entry: path.join(__dirname, './src/index.js'),
    output:{
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js', //打包后的文件名称
        path: path.resolve(__dirname,'./dist') //打包后的目录
    },
    module: {
        rules: [ // 转换规则
            {
                test: /\.css$/, //匹配所有的 css 文件
                use: 'css-loader' // use: 对应的 Loader 名称
            }
        ]
    }
}