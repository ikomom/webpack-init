
const path = require('path')

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output:{
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js', //打包后的文件名称
        path: path.resolve(__dirname,'./dist') //打包后的目录
    }
}