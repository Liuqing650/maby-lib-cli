# maby-lib-cli

## 简介

用于快速搭建 library 的基础环境，使用 babel 进行编译， webpack 进行打包。


[![NPM](https://nodei.co/npm/maby-lib-cli.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/maby-lib-cli/)

``` bash
npm i maby-lib-cli --save-dev

yarn add maby-lib-cli -D
```

## 安装

``` bash
npm install

yarn
```

## 使用

**初始化项目**

> 在安装项目时会默认执行一次初始化项目命令
> v1.0.0 版本只初始化 `package.json` 下的执行命令， 可手动执行 `npm run init` 初始化项目

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
    }
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

## 目录结构

```jsx
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
  ├─ .eslintrc              eslint配置文件夹
  ├─ postcss.config.js      postcss配置文件夹
```
