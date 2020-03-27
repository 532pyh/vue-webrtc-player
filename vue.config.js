const webpack = require('webpack');
const path = require('path');
function resolve(dir) {
    return path.resolve(__dirname, dir)
}
module.exports = {
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        },
    },
    css: {
        extract: false,
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': resolve('packages'),
                'assets': resolve('examples/assets'),
                'views': resolve('examples/views'),
            }
        },
        output: {
            libraryExport: 'default'
        },
        plugins: [
            new webpack.ProvidePlugin({
                'videojs': 'video.js'
            })
        ]
    },
    chainWebpack: config => {
        config.module
            .rule('js')
            .include
            .add('/packages')
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options
            })
        config.externals({
            'vue': 'Vue',
            'element-ui': 'element-ui',
        });
    },
    outputDir: 'lib',
    productionSourceMap: false,
    devServer: {
        port: 8093,
        hot: true,
        open: 'Google Chrome'
    },
}