const path = require("path");
// The path to the CesiumJS source code
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const webpack = require("webpack");
const CopywebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  context: __dirname,
  entry: "./src/index.js",
  output: {
   filename: '[name].js',
   path: path.resolve(__dirname, 'dist'),

   // Needed to compile multiline strings in Cesium
   sourcePrefix: ''
},
  amd: {
    toUrlUndefined: true,
  },
  devtool: "eval",
  node: {
    // Resolve node module use of fs
    fs: "empty",
    Buffer: false,
    http: "empty",
    https: "empty",
    zlib: "empty",
  },
  resolve: {
    mainFields: ["module", "main"],
    alias: {
      // CesiumJS module name
      cesium: path.resolve(__dirname, cesiumSource),
    },
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
         test: /\.js$/,
         use: 'babel-loader',
      },
      {
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
      },
      {
         test: /\.(png|j?g|svg|gif)?$/,
         use: 'file-loader'
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
    unknownContextCritical: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopywebpackPlugin({
      patterns: [
         { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
      ]
   }),
    new CopywebpackPlugin({
      patterns: [
      { from: path.join(cesiumSource, "../Build/Cesium/Assets"), to: "Assets" },
      ]
   }),
    new CopywebpackPlugin({
      patterns: [
      {
        from: path.join(cesiumSource, "../Build/Cesium/Widgets"),
        to: "Widgets",
      },
      ]
   }),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
    }),
  ],
};
