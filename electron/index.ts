import * as fs from 'node:fs'

const sqlite3 = require('sqlite3').verbose()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('./menu')
// 屏蔽安全警告
// electron Security Warning (Insecure Content-Security-Policy)

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let db
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // Load your file
    win.loadFile('dist/index.html')
  }

  win.webContents.openDevTools()
}
app.whenReady().then(() => {
  createWindow()
  dbInit()
})
const dbInit = () => {
  // Ensure the directory exists
  const dbPath = path.join(__dirname, 'data', 'data.db')
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  // Open SQLite database
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err)
    } else {
      console.log('Database opened successfully')
    }
  })

  // Create a table if not exists
  db.run('CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)', (err) => {
    if (err) {
      console.error('Error creating table', err)
    }
  })
}
// 處理IPC通信
ipcMain.handle('set-data', (event, key, value) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)', [key, value], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
})

ipcMain.handle('get-data', (event, key) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM kv_store WHERE key = ?', [key], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row ? row.value : null)
      }
    })
  })
})
