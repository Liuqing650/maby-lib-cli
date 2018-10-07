const fs = require('fs');
const path = require('path');

/**
 * 判断文件是否存在
 * @param {*string} dir 路径
 * @param {*any} existence 需要判断是否存在的文件
 */
function handleIsExists(dir, existence) {
  let isExists = true;
  if (Array.isArray(existence)) {
    existence.map((file) => {
      fs.exists(path.resolve(dir, file), (exists) => {
        if (!exists) {
          isExists = false;
        }
      });
    });
  } else if (typeof existence === 'string') {
    fs.exists(dir, (exists) => {
      isExists = !!exists;
    });
  } else if (typeof existence === 'object' && existence.file) {
    fs.exists(path.join(dir, existence.file), (exists) => {
      isExists = !!exists;
    });
  }
  return isExists;
}
module.exports = handleIsExists;
