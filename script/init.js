const path = require('path');
const vfs = require('vinyl-fs');
const through = require('through2');
const chalk = require('chalk');

module.exports = (projectPath) => {
  const cwd = path.join(__dirname, '../template');
  process.chdir(projectPath);
  vfs.src(['**/*', '!node_modules/**/*'], {cwd, cwdbase: true, dot: true})
    .pipe(through.obj(function(file, enc, callback) {
      if (!file.stat.isFile()) {
        return callback();
      }
      this.push(file);
      return callback();
    }))
    .pipe(vfs.dest(projectPath))
    .on('end', () => {
      console.log(chalk.green('init success!\n'));
    })
    .resume();
};
