# 初识 webpack

为什么需要构建工具？试想一下，假如没有构建工具，我们平常用到的打包、转换、压缩等一些列处理都难以实现，所以我们需要构建工具。webpack 就是一个功能强大的构建工具，通过 webpack 的配置文件，我们更能方便地定制构建流程。webpack 默认配置文件为 webpack.config.js，也可以通过 webpack --config 指定配置文件，当没有指定配置文件时会到根目录查找 webpack.config.js 文件。

```
// webpack.config.js
module.exports = {
  entry: "./src/index.js", // 打包的入口文件
  output: "./dist/main.js", // 打包的输出
  mode: "production", //环境
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }] // loader配置
  },
  plugins: [ // 插件配置
    new HtmlwebpackPlugin({
      template: "./src/index.html"
    })
  ]
};
```

上例中定义的就是一个基本的配置文件，我们需要知道一些基本概念。

### 基本概念

- entry

  webpack 打包的入口文件，表示打包从哪个文件开始来构建内部依赖图，默认值是 `./src/index.js`，也可以通过 entry 来指定，事实上 webpack 支持多种方式定义 entry 属性:

  **1）单个入口语法**

  用法：entry: `string|Array<string>`

  ```
  // webpack.config.js
  module.exports = {
    entry: './path/to/my/entry/file.js'
  };
  ```

  entry 属性的单个入口语法，是下面这种对象语法的简写：

  ```
  // webpack.config.js
  module.exports = {
    entry: {
      main: './path/to/my/entry/file.js'
    }
  };
  ```

  当想要把不相关的多个文件打包到一起时就可以用数组的方式定义入口，下面的 index.js 和 jquery.js 最终会打包为一个 bundle 文件。

  ```
  // webpack.config.js
  // create a bundle out of index.js and then appends jquery to the end
  module.exports = {
    entry: ['./src/index.js', './vendor/jquery.js']
  };
  ```

  > 在 webpack < 4 的版本中，通常将 vendor 作为单独的入口起点添加到 entry 选项中，以将其编译为单独的文件（与 CommonsChunkPlugin 结合使用）。而在 webpack 4 中不鼓励这样做。而是使用 optimization.splitChunks 选项，将 vendor 和 app(应用程序) 模块分开，并为其创建一个单独的文件。不要 为 vendor 或其他不是执行起点创建 entry。

  **2）对象语法**

  用法：entry: `{[entryChunkName: string]: string|Array<string>`}

  ```
    // webpack.config.js
    module.exports = {
    entry: {
        main: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: './dist',
        filename: '[name].js'//main.js和search.js
    }
    };
  ```

  如果项目有多个 html 文件，可以通过对象语法来指定多个页面的入口文件，从而为不同的页面生成不同的 bundle 文件。

  > 使用 optimization.splitChunks 为页面间共享的应用程序代码创建 bundle。由于入口起点增多，多页应用能够复用入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益。

- output

  output 指定输出的 bundle 文件放到哪里，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件目录中。

  **1）单个入口文件**

  ```
  const path = require('path');
  module.exports = {
    entry: './path/to/my/entry/file.js',
    output: {
      path: path.resolve(__dirname, 'dist'),//输出的目录，必须为绝对路径
      filename: 'bundle.js'//输出的文件名
    }
  };
  ```

  **2）多个入口文件**
  下例中的[name]为占位符，表示入口文件的 key(main、search)，通过占位符就可以为不同的入口生成不同名称的文件，占位符还有[id]、[hash]等。

  ```
  // webpack.config.js
  module.exports = {
    entry: {
      main: './src/index.js',
      search: './src/search.js'
    },
     output: {
      path: './dist',
      filename: '[name].js'//main.js和search.js
    }
  };
  ```

  开发环境下并不会在本地生成文件，而是存储在内存中。

- loader

  由于 webpack 原生只支持 js 和 JSON 两种类型的文件，因此需要对其他类型的文件进行转换，进行转换的工具就是 loader，loader 可以链式调用，从右到左的顺序调用。
  在 webpack 的配置中 loader 有两个属性：

  1）test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
  2）use 属性，表示进行转换时，应该使用哪个 loader。

  ```
  module.exports = {
    module: {
      rules: [
        { test: /\.txt$/, use: 'raw-loader' }
      ]
    }
  };
  ```

  以上配置对一个 module 对象定义了 rules 属性，里面必须包含 test 和 use 属性，它告诉 webpack 编译器当遇到\.txt 结尾的文件用 raw-loader 处理一下。

- plugin

  loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
  想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

  ```
  const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
  const webpack = require('webpack'); // 用于访问内置插件

  module.exports = {
    module: {
      rules: [
        { test: /\.txt$/, use: 'raw-loader' }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({template: './src/index.html'})
    ]
  };
  ```

  在上面的示例中，通过插件 html-webpack-plugin 为应用程序生成 一个 HTML 文件，并自动注入所有生成的 bundle。

- mode

  mode 为 webpack 提供的模式参数，不同的模式 webpack 会开启不同的处理方法，包括三个参数：development, production 或 none。

  ```
  module.exports = {
    mode: 'production'
  };
  ```

- browser compatibility

  浏览器兼容性，webpack 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要提前加载 polyfill。

### 零配置打包

webpack4 后都可以零配置，entry、output 等使用默认值。

```
module.exports = {
  entry: './src/index.js', // 指定默认的 entry 为: ./src/index.js
  output: './dist/main.js', // 指定默认的 output 为: ./dist/main.js
};
```
