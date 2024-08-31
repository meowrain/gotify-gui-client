const { app, BrowserWindow } = require('electron');
const path = require('path');
const { dbInit } = require('./util/database');
require('./util/ipcHandler'); // 导入 IPC 处理模块

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
  }

  require('./menu');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  dbInit();
});
