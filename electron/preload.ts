const { contextBridge } = require('electron')
const ipcRender =  require('electron').ipcRenderer
contextBridge.exposeInMainWorld('api',{
  ipcRender: ipcRender,
  getData: (key:string) => ipcRender.invoke('get-data',key),
  setData: (key:string,value: string) => ipcRender.invoke('set-data',key,value)
})