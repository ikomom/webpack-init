const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devtool: 'source-map',
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3001,
  },
  output: {
    publicPath: "auto",
  },
  module: {
  },
  plugins: [
  ],
};

