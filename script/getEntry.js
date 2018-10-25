// 获取入口
const getEntry = ({isDev, libraryName, vendors, options}) => {
  if (isDev) {
    const output = {
      index: [`${process.cwd()}/example/index.js`],
      [libraryName]: `${process.cwd()}/src/index.js`,
    };
    if (vendors) {
      output.vendors = vendors;
    }
    return output;
  }
  if (options && options.preview) {
    const output = {
      index: [`${process.cwd()}/example/index.js`],
    };
    if (vendors) {
      output.vendors = vendors;
    }
    return output;
  }
  return {
    [libraryName]: `${process.cwd()}/src/index.js`,
  };
};
module.exports = getEntry;
