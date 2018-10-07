// 获取入口
const getEntry = ({isDev, libraryName, vendors}) => {
  if (isDev) {
    const output = {
      index: `${process.cwd()}/example/index.js`,
      [libraryName]: `${process.cwd()}/src/index.js`,
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
