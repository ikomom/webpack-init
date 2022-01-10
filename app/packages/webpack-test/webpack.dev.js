const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ConsoleLogWebpackPlugin = require('./sWebpack/plugin/ConsoleLog')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');

const svgToMiniDataURI = require('mini-svg-data-uri');

const common =  {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    mainFiles: ['index'],
    extensions: ['...', '.jsx'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@components': path.resolve(__dirname, 'src/components/'),
    }
  },
  plugins: [
    new WebpackManifestPlugin({}),
    // new ConsoleLogWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'index',
      template: "./public/index.html",
      filename: 'index.html',
      chunks: ['index', 'shared']
    }),
    new HtmlWebpackPlugin({
      title: 'viewport',
      template: "./public/index.html",
      filename: 'viewport.html',
      chunks: ['viewport', 'shared']
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.png/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name]-[hash][ext][query]'
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
  },
}

module.exports = [
  {
    name: 'test1',//dependOn 优化
    ...common,
    entry: {
      index: {
        import: './src/pages/index',
        dependOn: 'shared',
      },
      viewport: {
        import: './src/pages/viewport',
        dependOn: 'shared',
      },
      shared: [path.resolve(__dirname, 'src/utils/utils.js')]
    },
    output: {
      clean: true,
      publicPath: './',
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, './multi-page'),
      // assetModuleFilename: 'images/[name][ext][query]'
    },
    optimization: {
      // chunkIds: 'named',
      runtimeChunk: 'single',
    }
  },
  {
    name: 'test2',// splitChunks 优化
    ...common,
    entry: {
      index: {
        import: './src/pages/index',
      },
      viewport: {
        import: './src/pages/viewport',
      },
    },
    output: {
      clean: true,
      publicPath: './',
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, './multi-page-1'),
      // assetModuleFilename: 'images/[name][ext][query]'
    },
    optimization: {
      // moduleIds: 'deterministic',
      // chunkIds: 'named',
      runtimeChunk: 'single',
      splitChunks: {
        // chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          }
        }
      }
    }
  }
]