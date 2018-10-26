const path = require('path');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const parseJSON = require('parse-json-pretty');

function getBabel() {
  const userBabelrcPath = path.resolve(process.cwd(), '.babelrc');
  if (fs.existsSync(userBabelrcPath)) {
    const babelConfig = parseJSON(stripJsonComments(fs.readFileSync(userBabelrcPath, 'utf-8')), '.babelrc');
    return babelConfig;
  }
  return {
    presets: ['env', 'react', 'stage-0'],
    plugins: ['transform-class-properties']
  };
}

module.exports = getBabel;
