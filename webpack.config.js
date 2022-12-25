const path = require('path');
module.exports = {
    entry: "./animation-demo.js",
    mode: 'development',
    // output: {
    //     path: path.join(__dirname, './dist'),
    // },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: "createElement"}]]
                    }
                }
            }
        ]
    }
}