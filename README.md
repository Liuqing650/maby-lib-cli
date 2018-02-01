# maby-lib-cli

## 简介

用于快速搭建 library 的基础环境，使用 babel 进行编译， webpack 进行打包。

## 适用系统
Linux 、 UNIX 、 Windows

## 安装

```bash
sudo npm install 
```

```bash
yarn
```

## 使用

> 开发模式

- Linux 、 UNIX

```bash
npm run dev 或者
npm start
```

- Windows

```bash
npm start
```

> 生产模式 

- Linux 、 UNIX

```bash
npm run build 或者
npm run build:win
```

- Windows

```bash
npm run build:win
```

> 清空打包

- Linux 、 UNIX

```bash
npm run clean
```


## 目录结构

```jsx
  ├─ dist                  压缩 library.min.js
  ├─ example
  |  ├─ example.js         library 测试区
  |  ├─ index.js           开发模式入口
  ├─ lib                   生产环境库
  ├─ src
  |  ├─ index.js
  |  ├─ index.less
  ├─ Makefile              系统操作脚本
  ├─ webpack.dev.js        开发环境
  ├─ webpack.prod.js       生产环境
```
