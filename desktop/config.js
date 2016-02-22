// requirejs 配置, 以及设置 is_desktop_app 特殊字段
// 可以考虑把 Appest 提取到一个文件, 就是 html 页面需要改下脚本
// 做好模板共用

'use strict'

window.nodeRequire = require

var path = require('path')
var userConfig = require('./user-config')
var appest = require('./appest')

var conf = userConfig.readConfig('Appest')

// 增加桌面应用标记
var o = {
  is_desktop_app: true
}

window.Appest = Object.assign(o, appest, conf)

requirejs.config({
  baseUrl: path.resolve(__dirname, '../scripts/'),
  paths: {
    Handlebars: 'libs/Handlebars',
    json: 'libs/json',
    text: 'libs/text',
    hbs: 'libs/hbs'
  }
})

requirejs(['webapp'])
