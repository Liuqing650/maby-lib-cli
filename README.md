# maby-lib-cli

## 简介

用于快速搭建 library 的基础环境，使用 babel 进行编译， webpack 进行打包。

[![NPM](https://nodei.co/npm/maby-lib-cli.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/maby-lib-cli/)

## 安装

``` bash
npm i maby-lib-cli --save-dev

yarn add maby-lib-cli -D
```

## 使用

**初始化项目**

> 在安装项目时会默认执行一次初始化项目命令

`>=v1.0.0` 版本只初始化 `package.json` 下的执行命令， 安装完成后需手动执行 `npm run init` 初始化项目

```bash
maby-lib init
```

**开发模式**

```bash
maby-lib start
```

**发布**

```bash
maby-lib build
```

**预览**

```bash
maby-lib preview
```

> 在 `package.json` 中配置好各个启动命令即可

## 更多配置

支持多种方式定义配置文件
- 在 `package.json` 中可以自定义配置项目

```json
{
  "name": "your lib",
  ...
  "mabycli": {
    "primary-color": "#fa8c16",
    "stylelint": true,
    "eslint": true,
    "vendors": [
      "react",
      "react-dom"
    ]
  }
}
```

- 在 `mabycli.js` 文件下自定义 `mabycli` 中的配置项

> 需在 `package.json` 中指明访问路径

```json
{
  "name": "your lib",
  ...
  "mabycli": "./mabycli.js"
}
```

- 在 `mabycli.js` 文件下自定义 `mabycli` 中的配置项

> 需在 `package.json` 中指明访问路径

```json
{
  "name": "your lib",
  ...
  "mabycli": "./mabycli.js"
}
```

```js
  const path = require('path');

  // 使用一个函数时，将给函数传递内置的 plugins、loaders、resolve， 返回类型和 webpack 对应配置一样
  const getPlugins = (plugins) => {
    return plugins.push(new Plugin());
  }
  // 一个方法或者一个对象
  module.exports = () => ({
    stylelint: true, // 是否开启 stylelint
    openBrowser: true, // 是否启动时打开浏览器
    eslint: true, // 是否开启 eslint
    vendors: [ // 需要提取的公共库
      "react",
      "react-dom"
    ],
    devServerOptions: { // webpack-dev-server 的配置项
      contentBase: path.join(process.cwd(), 'dist'),
      overlay: true,
      headers: {
        'access-control-allow-origin': '*',
      },
      open: true,
      port: 3300,
      stats: {
        modules: false,
        colors: true
      }
    },
    // v 2.0.0 新增功能
    plugins: [new Plugin()] || getPlugins, // webpack的 plugins 配置
    loaders: [{...some loaders}] || getLoaders, // webpack的 loaders 配置
    resolve: ['.js', '.jsx', '.json'] || getResolve, // webpack的 resolve 配置
  });
```

- 在 `.mabycli` 文件下自定义 `mabycli` 中的配置项

```json
{
  "primary-color": "#fa8c16",
  "stylelint": true,
  "eslint": true,
  "vendors": [
    "react",
    "react-dom"
  ]
}
```

- 配置 `antd` 主题样式

**package.json**

```json
{
  "name": "your lib",
  ...
  "dependencies": {
    "antd": "^3.11.0"
  },
  "mabycli": "./mabycli.js",
  "theme": {
    "primary-color": "#fa541c" // 设置主题样式
  }
}
```

**.babelrc**

```json
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": true
      }
    ]
  ]
}
```

**mabycli.js**

```jsx
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const getTheme = () => {
  let theme = {};
  // 获取主题颜色
  const pkgPath = path.resolve(__dirname, './package.json');
  const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};
  if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(__dirname, cfgPath);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
  } else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme;
  }
  return theme;
};

const getLoaders = (loaders) => {
  const theme = getTheme();
  if (!theme) {
    return loaders;
  }
  // 利用 modifyVars 修改主题样式
  const themeLoaders = {
    test: /\.less$/,
    include: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader', 'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            modifyVars: theme
          }
        }
      ]
    })
  };
  // 修改内部loader 的 exclude
  loaders.forEach(loader => {
    const isLess = RegExp(loader.test).test('.less');
    if (isLess) {
      loader.exclude = /node_modules/;
    }
  });
  loaders.push(themeLoaders);
  return loaders;
};

// 修改 ExtractText， 修改antd主题样式时，需要设置 allChunks: true
const getExtractTextPlugin = (ExtractText) => {
  return {
    filename: ExtractText.filename,
    allChunks: true,
  };
};
module.exports = () => ({
  stylelint: true,
  port: 10056,
  loaders: getLoaders,
  extractTextPlugin: getExtractTextPlugin
});

```

版本变化信息查看

[发布日志](https://github.com/Liuqing650/maby-lib-cli/blob/master/CHANGELOG.md)

## 目录结构

```text
  ├─ dist                   压缩文件 library.[version].min.js/library.[version].min.css
  ├─ example                预览环境
  |  ├─ example.js          library 测试区
  |  ├─ index.js            开发模式入口
  ├─ lib                    生产环境库
  ├─ src                    开发环境
  |  ├─ components
  |  |  ├─ style
  |  |  ├─ index.js
  |  ├─ style
  |  ├─ index.js
  ├─ .babelrc
  ├─ .eslintignore
  ├─ .gitignore
  ├─ .eslintrc              eslint配置文件夹
  ├─ postcss.config.js      postcss配置文件夹
  ├─ README.md
```
