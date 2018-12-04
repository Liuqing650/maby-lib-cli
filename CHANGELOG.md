更新日志
=========

v2.0.1
------

1. 支持 `antd` 及其主题样式修改， 具体[可以查看](https://github.com/Liuqing650/maby-lib-cli/blob/master/README.md)

2. 新增 `extractTextPlugin` 配置， 支持自定义配置 `ExtractTextPlugin( my config )`

v2.0.0
------

优化： `webpack.config.js` 配置权限放开
调整： 打包时内置 `babel` 将获取 `.babelrc` 中的配置信息

1. 新增 `plugins`， 支持自定义配置 `webpack` 的 `plugins`， 接收数组、函数

2. 新增 `loaders`， 支持自定义配置 `webpack` 的 `loaders`， 接收数组、函数

3. 新增 `resolve`， 支持自定义配置 `webpack` 的 `resolve`， 接收数组、对象、函数

4. 初始化项目时将新增 `README.md` 和 `.gitignore` 文件， 初始化时需谨慎

v1.1.1
------

1. 修复 `package.json` 中 `version: x.0.0.beta.01` 导致报错bug

v1.1.0
------

1. 添加预览命令 `npm run preview`

v1.0.0
------

1. 优化构建环境

2. 修复每次安装会初始化项目的bug

3. 安装完成后只初始化 `package.json` 的执行函数

v0.0.1
------

发布第一个可运行版本

v0.0.1-beta.10
------

maby-lib-cli

快速构建一个私有库项目
