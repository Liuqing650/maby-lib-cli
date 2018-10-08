# maby-lib-cli

## 简介

用于快速搭建 library 的基础环境，使用 babel 进行编译， webpack 进行打包。


## 安装

```bash
npm install 
```

```bash
yarn
```

## 使用

**初始化项目**

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
