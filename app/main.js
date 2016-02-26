'use strict'

let path = require('path'),
    electron = require('electron')

let app = electron.app

let Menu = electron.Menu,
    BrowserWindow = electron.BrowserWindow,
    ipc = electron.ipcMain,
    globalShortcut = electron.globalShortcut

let userConfig = require('./user-config'),
    menu = require('./menu'),
    appest = require('./appest')

let setAppest = data => {
  userConfig.saveConfig(data)
}

// register shortcut
let registerShortcut = () => {
  let ret = globalShortcut.register('Command+Shift+A', () => {
    if(indexWindow) {
      indexWindow.show()
      indexWindow.focus()
    }
  })
  if (!ret) {
    console.log('registration failed')
  }
}

let unRegisterShortcut = () => {
  globalShortcut.unregisterAll()
}

// app.commandLine.appendSwitch('ignore-certificate-errors', 'true')

// Report crashes to our server.
electron.crashReporter.start()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform != 'darwin') {
    unRegisterShortcut()
    app.quit()
  // }
})

let signin = data => {
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
ipc.on('signin', (event, data) => {
  signin(data)
})

// 登出
ipc.on('signout', (event, data) => {
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
app.on('ready', () => {
  let config = userConfig.readConfig('Appest')
  if(config && config.user && config.user.inboxId) {
    openIndex()
  } else {
    openLogin()
  }
  Menu.setApplicationMenu(menu)
  registerShortcut()
})

// 默认窗口状态
let defaultWin = {
  width: 620,
  height: 600,
  minWidth: 600,
  resizable: false,
  title: appest.productName,
  icon: path.resolve('./icons/', 'icon.png')
}

// 登陆窗口
let loginWindow
let openLogin = () => {

  let win = Object.assign({}, defaultWin)

  loginWindow = new BrowserWindow(win)

  loginWindow.loadURL('file://' + __dirname + '/signin.html')

  // loginWindow.webContents.openDevTools()

  loginWindow.on('closed', () => {
    loginWindow.destroy()
    loginWindow = null
  })
}

// 登录之后
let indexWindow = null
let openIndex = () => {
  if (indexWindow)
    return

  let win = Object.assign({}, defaultWin, {
    height: 55,
    transparent: false,
    frame: false
  })

  indexWindow = new BrowserWindow(win)

  indexWindow.loadURL('file://' + __dirname + '/index.html')

  // indexWindow.webContents.openDevTools()

  indexWindow.on('closed', () => {
    indexWindow.destroy()
    indexWindow = null
  })
}
