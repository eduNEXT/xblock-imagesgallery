const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleTracker = require('webpack-bundle-tracker');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');


module.exports = {
  entry: path.resolve(__dirname, "react-app", "index.js"),
  output: {
    path: path.resolve(__dirname, "imagesgallery", "static", "dist"),
    filename: "bundle.js",
    libraryTarget: "umd"
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
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: 'file-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
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
    new WebpackManifestPlugin({
      seed: {
        base_url: '/static/dist',
      },
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, "react-app"), "node_modules"],
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      '@components': path.resolve(__dirname, 'react-app/components'),
      '@utils': path.resolve(__dirname, 'react-app/utils'),
      '@contexts': path.resolve(__dirname, 'react-app/contexts'),
      '@constants': path.resolve(__dirname, 'react-app/constants'),
      "@config": path.resolve(__dirname, 'react-app/config'),
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'react-app', 'public'),
    },
    port: 3000,
    hot: true,
  }
};
