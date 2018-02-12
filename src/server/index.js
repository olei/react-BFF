require('babel-core/register')
require('babel-polyfill')
// require('./main.js')

const WebpackIsomorphicTools = require('webpack-isomorphic-tools')
const projectBasePath = require('path').join(__dirname, '../../')
global.webpack_isomorphic_tools = new WebpackIsomorphicTools(require('../../build/webpack-isomorphic-tools-configuration')).server(projectBasePath).then(() => { require('./main') })