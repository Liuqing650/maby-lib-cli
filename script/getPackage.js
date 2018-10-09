const path = require('path');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const parseJSON = require('parse-json-pretty');

const configFile = '.mabycli';
// 获取环境信息
const pkgPath = path.resolve(process.cwd(), 'package.json');
const mabycliPath = path.resolve(process.cwd(), configFile);
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
  _mabycli = typeof getMabycli === 'function' ? getMabycli() : getMabycli;
} else if (pkg.mabycli && typeof pkg.mabycli === 'object') {
  _mabycli = pkg.mabycli;
} else if (fs.existsSync(mabycliPath)) {
  _mabycli = parseJSON(stripJsonComments(fs.readFileSync(mabycliPath, 'utf-8')), configFile)
}

const mabycli = _mabycli;
module.exports = {
  libraryName,
  version,
  mabycli
};
