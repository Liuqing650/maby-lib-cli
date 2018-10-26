# your-lib

## 简介

关于 `your-lib` 的简介.

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

版本变化说明

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
