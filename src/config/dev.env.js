'use strict'
const merge = require('webpack-merge')
const proEnv = require('./prod.env')

// dev.env.js下的配置。
module.exports = merge(proEnv, {
    NODE_ENV: '"development"',
    MOCK: true //开发环境使用mock
})
