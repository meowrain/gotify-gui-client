const { contextBridge } = require('electron')
const ipcRender = require('electron').ipcRenderer
// 监听 WebSocket 消息
ipcRender.on('websocket-message', (event, message) => {
  console.log('Received WebSocket message:', message);
  // 处理 WebSocket 消息，例如更新 Vue 数据
  // 例如，使用 Vuex 或 Vue 的响应式系统来处理消息
});

ipcRender.on('websocket-error', (event, error) => {
  console.error('WebSocket error:', error);
  // 处理 WebSocket 错误
});

ipcRender.on('websocket-close', (event, { code, reason }) => {
  console.log('WebSocket closed:', code, reason);
  // 处理 WebSocket 关闭
});
contextBridge.exposeInMainWorld('api', {
  ipcRender: ipcRender,
  getData: (key: string) => ipcRender.invoke('get-data', key),
  setData: (key: string, value: string) => ipcRender.invoke('set-data', key, value),
  connectWebSocket: async (url) => {
    return ipcRender.invoke('connect-websocket', url);
  },
  disconnectWebSocket: async () => {
    return ipcRender.invoke('disconnect-websocket');
  },
  receiveFromWebsocket: (callback) => {
    ipcRender.on('websocket-message', (event, message) => {
      callback(message);
    });
    ipcRender.on('websocket-error', (event, error) => {
      console.error('WebSocket error:', error);
    });
    ipcRender.on('websocket-close', (event, { code, reason }) => {
      console.log('WebSocket closed:', code, reason);
    });
  }
})
