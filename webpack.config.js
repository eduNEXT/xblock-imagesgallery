const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "react-app", "index.js"),
  output: {
    path: path.resolve(__dirname, "imagesgallery", "static", "html"),
    filename: "bundle.js",
    libraryTarget: "window"
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "react-app", "index.html"),
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, "react-app"), "node_modules"],
    extensions: [".js", ".jsx", ".tsx", ".ts"]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'react-app', 'public'),
    },
    port: 3000,
    hot: true,
  }
};
