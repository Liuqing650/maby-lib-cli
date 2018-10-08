const path = require('path');
const vfs = require('vinyl-fs');
const fs = require('fs');
const through = require('through2');
const chalk = require('chalk');

function addPackageCommand(pgc, projectPath) {
  if (!pgc.scripts) {
    pgc.scripts = {};
  }
  pgc.scripts = Object.assign(pgc.scripts, {
    start: 'maby-lib start',
    build: 'maby-lib build',
    init: 'maby-lib init',
  });
  fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(pgc, null, 2));
}

function initCommand() {
  const pgc = require(path.join(process.cwd(), 'package.json'));
  if (!pgc) {
    process.exit(1);
  } else {
    addPackageCommand(pgc, process.cwd());
    console.log(chalk.green('init command success!\n'));
  }
}
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
      initCommand();
    })
    .resume();
};
