const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    app: './services/course-crawler/src/run.js'
  },
  output: {
    filename: 'application-course.js',
    path: path.resolve(__dirname, 'dist')
  }
};
