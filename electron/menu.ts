
const { Menu,BrowserWindow } = require('electron')
function changeUrl(data) {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/#${data.route}`);
  } else {
    console.error('No focused window found');
  }
}

const template = [
  {
    label: '主頁',
    click: ()=>{
      changeUrl({route: '/'})
    }
  },
  {
    label: '配置',
    click: () => {
      changeUrl({route: '/config'})
    }
  },
  {
    label: '關於',
    click: () => {
      changeUrl({route: '/about'})
    }
  }
]
const myMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(myMenu)