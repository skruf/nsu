import Vue from "vue"
const { ipcRenderer } = window.require("electron")

Vue.prototype.$ipc = ipcRenderer
