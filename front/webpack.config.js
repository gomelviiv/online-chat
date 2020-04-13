const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ['babel-polyfill', "./src/index.js"],
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js"
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  module: {
    rules: [
      {
       test: /\.(js|jsx)$/,
       exclude: /node_modules/,
       use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: 'css-loader',
            options:  {
                url: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ]
};