const path = require('path');
const { realpathSync } = require('fs');
const init = require('../lib/init');

function resolveProject(relativePath) {
  return path.resolve(realpathSync(process.cwd()), relativePath);
}
const projectPath = resolveProject('../../');
init(projectPath);
