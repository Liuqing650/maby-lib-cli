// 连字符转驼峰
function hyphenToHump(str) {
  return str.replace(/-(\w)/g, function() {
    return arguments[1].toUpperCase();
  });
}
function humpToHyphen(str) {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase();
}
module.exports = {
  hyphenToHump,
  humpToHyphen
};
