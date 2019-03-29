'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const fs = require('fs')
const path = require('path')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK_JS: fs.existsSync(path.resolve('.mock'))
})
