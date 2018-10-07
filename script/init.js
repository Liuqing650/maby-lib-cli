const path = require('path');
// const fs = require('fs');
// const mkdirpSync = require('fs-extra').mkdirpSync;
const vfs = require('vinyl-fs');
const through = require('through2');


module.exports = (projectPath) => {
  // console.log('projectPath----->', projectPath);
  const cwd = path.join(__dirname, '../template');
  // const { existsSync } = fs;
  function template() {
    return through.obj((file, enc, cb) => {
      if (!file.stat.isFile()) {
        return cb();
      }
      this.push(file);
      cb();
    });
  };
  // if (existsSync(projectPath)) {
  //   console.error('Existing directory here, please run new command for an empty folder!');
  //   process.exit(1);
  // }
  // mkdirpSync(projectPath);
  process.chdir(projectPath);
  vfs.src(['**/*', '!node_modules/**/*'], {cwd, cwdbase: true, dot: true})
    .pipe(template())
    .pipe(vfs.dest(projectPath))
    .on('end', () => {
      console.log(chalk.green('init success!\n'));
    })
    .resume();
};
