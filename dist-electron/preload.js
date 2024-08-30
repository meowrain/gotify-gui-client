const { contextBridge } = require("electron");
const ipcRender = require("electron").ipcRenderer;
contextBridge.exposeInMainWorld("api", {
  ipcRender,
  getData: (key) => ipcRender.invoke("get-data", key),
  setData: (key, value) => ipcRender.invoke("set-data", key, value)
});
