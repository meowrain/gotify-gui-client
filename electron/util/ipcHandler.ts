const { ipcMain } = require('electron')
const { setData, getData } = require('./database');
const { connectWebSocket, disconnectWebSocket } = require('./websocket');
const { pushMessage ,checkHealth} = require('./request');

// IPC for database
ipcMain.handle('set-data', async (event, key, value) => {
  try {
    await setData(key, value);
  } catch (err) {
    console.error('Error setting data:', err);
    throw err;
  }
});

ipcMain.handle('get-data', async (event, key) => {
  try {
    return await getData(key);
  } catch (err) {
    console.error('Error getting data:', err);
    throw err;
  }
});

// IPC for WebSocket
ipcMain.handle('connect-websocket', connectWebSocket);
ipcMain.handle('disconnect-websocket', disconnectWebSocket);

// IPC for HTTP Request
ipcMain.handle('push-message', pushMessage);

// 使用 net 模块实现 checkServerStatus 的功能
ipcMain.handle('check-server-status',checkHealth);