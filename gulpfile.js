const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const merge2 = require('merge2');
const through2 = require('through2');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const babel = require('gulp-babel');
const transformLess = require('./script/transformLess');
const webpack = require('webpack');

const cwd = process.cwd();

const libDir = path.join(cwd, 'lib');

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

function babelify(js, modules) {
  let stream = js.pipe(babel({
      presets: ['env'],
      plugins: ["transform-class-properties"]
    }))
    .pipe(through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
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
  rimraf.sync(libDir);
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
  let error = 0;
  const source = [
    'src/**/*.js',
    'src/**/*.jsx'
  ];
  const jsResult = gulp.src(source);
  const tsFilesStream = babelify(jsResult, modules);
  const tsd = jsResult.pipe(gulp.dest(libDir));
  return merge2([less, tsFilesStream, tsd, assets]);
}

gulp.task('compile', () => {
  compile();
});

gulp.task('default', ['compile']);
