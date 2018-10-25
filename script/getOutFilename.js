// 获取文件输出名称
const getOutFilename = ({fileType, isDev, isMINI, version, libraryName, options}) => {
  if (isDev) {
    return `[name].${fileType}`;
  }
  if (options && options.preview) {
    return `[name].${fileType}`;
  }
  const _version = version ? `.${version}` : '';
  const suffix = isMINI ? `.min.${fileType}` : `.${fileType}`;
  const filename = `${libraryName}${_version}${suffix}`;
  return filename;
};
module.exports = getOutFilename;
