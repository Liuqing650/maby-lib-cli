const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const merge2 = require('merge2');
const through2 = require('through2');
const webpack = require('webpack');
const gulp = require('gulp');
const babel = require('gulp-babel');
const transformLess = require('./lib/transformLess');
const createWebpackConfig = require('./webpack.config.js');
const getBabel = require('./lib/getBabel.js');
const packageInfo = require('./lib/getPackage.js');

const cwd = process.cwd();

const { mabycli } = packageInfo;

const libDir = path.join(cwd, mabycli.dir || 'lib');
const distDir = path.join(cwd, 'dist');
const previewDir = path.join(cwd, 'preview');

const deleteLibDir = mabycli.deleteFile ? `${libDir}/**/*` : libDir;

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function buildWebpack(isMini = false) {
  process.env.MINI = isMini;
  process.env.NODE_ENV = 'production';
  if (!isMini) {
    rimraf.sync(distDir);
  }
  const webpackConfig = createWebpackConfig(process.env);
  webpack(webpackConfig, (err) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  });
}

function preview() {
  rimraf.sync(previewDir);
  process.env.NODE_ENV = 'production';
  process.env.PREVIEW = true;
  process.env.ASSET_PATH = './';
  const webpackConfig = createWebpackConfig(process.env);
  webpack(webpackConfig, (err) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  });
}

function analyzer() {
  process.env.ANALYZER = true;
  process.env.NODE_ENV = 'production';
  const webpackConfig = createWebpackConfig(process.env);
  webpack(webpackConfig, (err) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  });
}

function babelify(js, modules) {
  const babelConfig = getBabel();
  let stream = js.pipe(babel(babelConfig))
    .pipe(through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      // 查找包含style样式文件夹，替换掉原来引入的less为css
      if (file.path.match(/\/style\/index\.js/)) {
        const content = file.contents.toString(encoding);
        file.contents = Buffer.from(content
          .replace(/\/style\/?'/g, '/style/css\'')
          .replace(/\.less/g, '.css'));
        file.path = file.path.replace(/index\.js/, 'index.js');
        this.push(file);
        next();
      } else {
        next();
      }
    }));
  return stream.pipe(gulp.dest(libDir));
}

function compile(modules) {
  rimraf.sync(deleteLibDir);
  const less = gulp.src(['src/**/*.less'])
    .pipe(through2.obj(function (file, encoding, next) {
      if (file.path.match(/\/style\/index\.less$/)) {
        transformLess(file.path).then((css) => {
          file.contents = Buffer.from(css);
          file.path = file.path.replace(/\.less$/, '.css');
          this.push(file);
          next();
        }).catch((e) => {
          console.error(e);
        });
      } else {
        next();
      }
    }))
    .pipe(gulp.dest(libDir));
  const assets = gulp.src(['src/**/*.@(png|svg)']).pipe(gulp.dest(libDir));
  const source = [
    'src/**/*.js',
    'src/**/*.jsx'
  ];
  const jsResult = gulp.src(source);
  const tsFilesStream = babelify(jsResult, modules);
  const tsd = jsResult.pipe(gulp.dest(libDir));
  return merge2([less, tsFilesStream, tsd, assets]);
}

gulp.task('analyzer', () => {
  analyzer();
});

gulp.task('preview', () => {
  preview();
});

gulp.task('build:babel', (done) => {
  buildWebpack(false, done);
});

gulp.task('build:mini', (done) => {
  buildWebpack(true, done);
});

gulp.task('compile', () => {
  compile();
});

gulp.task('build', ['build:babel', 'build:mini', 'compile']);

gulp.task('default', ['build:babel', 'build:mini', 'compile']);
