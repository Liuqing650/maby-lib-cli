// 获取文件输出名称
const getOutFilename = ({fileType, isDev, isMINI, version, libraryName}) => {
  if (isDev) {
    return `[name].${fileType}`;
  }
  const _version = version ? `.${version}` : '';
  const suffix = isMINI ? `.min.${fileType}` : `.${fileType}`;
  const filename = `${libraryName}${_version}${suffix}`;
  return filename;
};
module.exports = getOutFilename;
