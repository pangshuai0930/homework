var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"demo"',
	// BASE_API: '"https://baycloud.cn/api/"',
	BASE_API: '"http://qiawei-support-api.demo.qiawei.com/api/v1/"',
})