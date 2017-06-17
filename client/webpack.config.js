const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        "./src/index.tsx",
        "./src/index.scss",
        "whatwg-fetch"
    ],
    output: {
        path: path.join(__dirname, "..", "www"),
        filename: "[name].js"
    },
    devtool: "source-map",
    devServer: {
        contentBase: "./static"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: ["css-loader", "sass-loader"],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(ttf|eot|woff)$/,
                loader: "file-loader",
                options: {
                    name: "fonts/[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
};
