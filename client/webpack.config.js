var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    output: {
        path: __dirname + "/../web/",
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    devtool: "source-map",
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
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader"
            }
        ]
    },
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM",
    //     "@blueprintjs/core": "Blueprint.Core",
    //     "tether": "Tether",
    //     "classnames": "classNames",
    //     "react-addons-css-transition-group": "React.addons.CSSTransitionGroup"
    // },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
};
