const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  {
    entry: {
      main: "./index.js"
    },
    output: {
      filename: isProd ? "[name]-bundle-[contenthash].js" : "[name]-bundle.js",
      chunkFilename: isProd
        ? "[name]-chunk-[contenthash].js"
        : "[name]-chunk.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist/"
    },
    resolve: {
      extensions: [".mjs", ".ts", ".tsx", ".js", ".svelte"],
      alias: {
        svelte: path.resolve("node_modules", "svelte")
      },
      modules: [path.resolve("./"), path.resolve("./node_modules")],
      mainFields: ["svelte", "browser", "module", "main"]
    },
    mode: isProd ? "production" : "development",
    module: {
      rules: [
        {
          test: /\.(html|svelte)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              query: {
                presets: ["@babel/preset-typescript"],
                plugins: [
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-syntax-dynamic-import",
                  "@babel/plugin-proposal-optional-chaining",
                  "@babel/plugin-proposal-nullish-coalescing-operator"
                ]
              }
            },
            {
              loader: "svelte-loader",
              options: {
                emitCss: true
              }
            }
          ]
        },
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: ["@babel/preset-typescript"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator"
            ]
          }
        },
        {
          test: /\.graphql$/,
          exclude: /node_modules/,
          use: {
            loader: "generic-persistgraphql/loader",
            options: {
              path: path.resolve(__dirname, "extracted_queries.json")
            }
          }
        },
        {
          test: /\.s?css$/,
          oneOf: [
            {
              test: /\.module\.s?css$/,
              use: [
                MiniCssExtractPlugin.loader,
                { loader: "css-loader", options: { modules: true } },
                "sass-loader"
              ]
            },
            {
              use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    },
    optimization: {
      //minimize: false
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "default.htm" }),
      new MiniCssExtractPlugin({
        filename: isProd ? "[name]-[contenthash].css" : "[name].css"
      })
    ].filter((p) => p),
    stats: {
      all: false,
      assets: true,
      modules: true,
      maxModules: 10,
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
      warningsFilter: (warning) =>
        !/mini-css-extract-plugin.*conflicting order between/i.test(warning)
    }
  }
];
