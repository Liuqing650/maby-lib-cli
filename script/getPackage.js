const path = require('path');
const fs = require('fs');

// 获取环境信息
const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};
const libraryName = pkg.name || 'maybe-lib';
const version = pkg.version.toLocaleLowerCase() || '';
let _mabycli = {};

if (pkg.mabycli && typeof pkg.mabycli === 'string') {
  let cfgPath = pkg.mabycli;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = path.resolve(process.cwd(), cfgPath);
  }
  const getMabycli = require(cfgPath);
  _mabycli = getMabycli();
} else if (pkg.mabycli && typeof pkg.mabycli === 'object') {
  _mabycli = pkg.mabycli;
}

const mabycli = _mabycli;
module.exports = {
  libraryName,
  version,
  mabycli
};
