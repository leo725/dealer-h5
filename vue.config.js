const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

module.exports = {
  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  pages:{
    index:{
      entry: 'src/main.js',
      title:'小胖车汽车资源共享平台'
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('api', resolve('./src/api'))
      .set('utils', resolve('./src/utils'))
      .set('views', resolve('./src/views'))
      .set('store', resolve('./src/store'))
      .set('router', resolve('./src/router'))
      .set('components', resolve('./src/components'))
      .set('store', resolve('./src/store'))
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {

    } else {

    }
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('postcss-pxtorem')({
            rootValue: 75,
            propList: ['*'],
            // selectorBlackList:['vant'],
            minPixelValue: 2,
          })
        ]
      }
    }
  },
  devServer: {
    hot: true,
    open: false,
    host: '0.0.0.0', // 允许外部ip访问
    overlay: {
      warnings: true,
      errors: true
    },
  }
}