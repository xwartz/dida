'use strict'

var path = require('path')
var electron = require('electron')

var app = electron.app  // Module to control application life.
var Menu = electron.Menu
var BrowserWindow = electron.BrowserWindow  // Module to create native browser window.
var ipc = electron.ipcMain

var userConfig = require('./desktop/user-config')
var menu = require('./desktop/menu')
var appest = require('./desktop/appest')

var setAppest = function (data) {
  userConfig.saveConfig(data)
}

// app.commandLine.appendSwitch('ignore-certificate-errors', 'true')

// Report crashes to our server.
// electron.crashReporter.start()


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform != 'darwin') {
    app.quit()
  // }
})

ipc.on('updateAppest', function (event, data) {
  setAppest(data)
})

var signin = function (data) {
  loginWindow && loginWindow.close()
  setAppest(data)
  if(indexWindow) {
    indexWindow.show()
    indexWindow.focus()
  } else {
    openIndex()
  }
}

// 登录
ipc.on('signin', function (event, data) {
  signin(data)
})

// 从 web 登陆，如第三方账户
ipc.on('signin-from-web', function (event, data) {
  signin(data)
})

// 登出
ipc.on('signout', function (event, data) {
  userConfig.clearConfig()
  indexWindow && indexWindow.close()
  if(loginWindow) {
    loginWindow.show()
    loginWindow.focus()
  } else {
    openLogin()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  var config = userConfig.readConfig('Appest')
  if(config && config.user && config.user.inboxId) {
    openIndex()
  } else {
    openLogin()
  }
  Menu.setApplicationMenu(menu)
})

// 默认窗口状态
var defaultWin = {
  width: 1024,
  height: 800,
  minWidth: 400,
  resizable: false,
  title: appest.productName,
  icon: path.resolve('./desktop/icons/', 'icon.png')
}

// 登陆窗口
var loginWindow
var openLogin = function () {

  var win = Object.assign({}, defaultWin)

  loginWindow = new BrowserWindow(win)

  loginWindow.loadURL('file://' + __dirname + '/signin.html')

  // loginWindow.webContents.openDevTools()

  loginWindow.on('closed', function () {
    loginWindow.destroy()
    loginWindow = null
  })
}

// 登录之后
var indexWindow = null
var openIndex = function () {
  if (indexWindow) return;

  var win = Object.assign({}, defaultWin)
  win.resizable = true

  indexWindow = new BrowserWindow(win)

  indexWindow.loadURL('file://' + __dirname + '/index.html')

  // indexWindow.webContents.openDevTools()

  indexWindow.on('closed', function () {
    indexWindow.destroy()
    indexWindow = null
  })
}
