const path = require('path');

// 获取loaders
const webpackResolve = (options) => {
  const userResolve = options.resolve;
  let resolve = {
    modules: [path.resolve(process.cwd(), 'src/'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  };
  if (userResolve) {
    if (typeof userResolve === 'function') {
      return userResolve(resolve);
    } else if (typeof userResolve === 'object') {
      if (Array.isArray(userResolve)) {
        resolve.extensions = userResolve;
      } else {
        resolve = userResolve;
      }
    }
  }
  return resolve;
};
module.exports = webpackResolve;
