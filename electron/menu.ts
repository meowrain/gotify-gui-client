const { Menu } = require('electron')
const template = [
  {
    label: '主頁',
  },
  {
    label: '設置'
  }
]
const myMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(myMenu)