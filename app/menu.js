// menu
'use strict'

let electron = require('electron')

let app = electron.app,
    shell = electron.shell,
    Menu = electron.Menu,
    ipc = electron.ipcMain

let appest = require('./appest')

let template = [{
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }, ]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.reload()
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: ( () => {
      if (process.platform === 'darwin')
        return 'Ctrl+Command+F'
      else
        return 'F11'
    })(),
    click (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
    }
  },
  {
    label: 'Toggle Developer Tools',
    accelerator: ( () => {
      if (process.platform === 'darwin')
        return 'Alt+Command+I'
      else
        return 'Ctrl+Shift+I'
    })(),
    click (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.toggleDevTools()
    }
  },
  ]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, ]
}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Learn More',
    click () {
      shell.openExternal('https://help.' + appest.domain)
    }
  }, ]
}, ]

if (process.platform === 'darwin') {
  let name = appest.productName
  // let name = app.getName()
  template.unshift({
      label: name,
      submenu: [{
        label: 'About ' + name,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Login Out',
        accelerator: 'Command+Shift+Q',
        click () {
          ipc._events.signout()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click () {
          app.quit()
        }
      }, ]
    })
    // Window menu.
  template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })
}

let menu = Menu.buildFromTemplate(template)

module.exports = menu
