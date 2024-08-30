import { app, BrowserWindow } from 'electron'
import path from 'node:path'
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true
    }
  })

  win.loadFile('./dist/index.html')
  win.webContents.openDevTools()

}
app.whenReady().then(() => {
  createWindow()
})