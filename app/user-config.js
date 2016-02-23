// 存储用户信息

'use strict'

var nconf = require('nconf')
var electron = require('electron')
var app = electron.app

var appest = require('./appest')

// 不是主进程的话, 渲染进程只能用 remote
if(!app) {
  var remote = electron.remote
  app = remote.app
}

nconf.file({
  file: getUserHome() + '/' + appest.domain + '.json'
})

function getUserHome() {
  return app.getPath('appData') + '/ticktick'
}

function _save (key, value) {
  nconf.set(key, value)
  nconf.save()
}

function readConfig(key) {
    nconf.load()
    return nconf.get(key)
}

function saveConfig(data) {
  var Appest = {}
  if(data.user) {
    Appest = Object.assign({}, data)
  } else {
    Appest = {
      user: {
        isGFS: data.pro,
        inboxId: data.inboxId,
        username: data.username
      },
      end_date: data.proEndDate,
    }
  }
  _save('Appest', Appest)
}

function clearConfig () {
  saveConfig({ inboxId: '' })
}

module.exports = {
    saveConfig: saveConfig,
    readConfig: readConfig,
    clearConfig: clearConfig
}
