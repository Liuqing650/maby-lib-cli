#!/usr/bin/env node

const gulp = require('gulp');
const program = require('commander');
const path = require('path');

program.on('--help', () => {
  console.log();
});

program
  .command('start')
  .description('start libary.')
  .action(() => {
    require('../lib/devServer');
  });

program
  .command('init')
  .description('init your project.')
  .action(() => {
    const projectPath = path.join(process.cwd());
    const init = require('../lib/init');
    init(projectPath);
  });

program.parse(process.argv);
const task = program.args[0];
if (!task) {
  program.help();
} else if (!['start', 'init'].includes(task._name)) {
  console.log('maby-lib run', task);

  require('../gulpfile');

  gulp.start(task);
}

program
  .usage('<command>');
