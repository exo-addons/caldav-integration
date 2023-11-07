const path = require('path');
const { merge } = require('webpack-merge');

const webpackProductionConfig = require('./webpack.prod.js');

// the display name of the war
const app = 'caldav-integration';

// add the server path to your server location path

const exoServerPath = "/home/exo/work/plf/plf-enterprise-tomcat-standalone-6.5.0-M30/platform-6.5.0-M30";


module.exports = merge(webpackProductionConfig, {
  output: {
    path: path.resolve(`${exoServerPath}/webapps/${app}/`)
  },
  mode: 'development',
  devtool: 'eval-source-map'
})
