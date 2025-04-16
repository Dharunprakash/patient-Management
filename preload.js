const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("electronAPI", {
 
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
});
