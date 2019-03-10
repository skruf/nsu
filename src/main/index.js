"use strict"

import { app, BrowserWindow, ipcMain } from "electron"
// import { autoUpdater } from "electron-updater"
import log from "electron-log"

const version = app.getVersion()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")

  const os = require("os")
  const Sentry = require("@sentry/electron")

  Sentry.init({
    dsn: "https://8f6797916b144212bbf53d3e927dab0e@sentry.io/1411934",
    release: `nsu@${version}`
  }, {
    captureUnhandledRejections: true,
    tags: {
      process: process.type,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      platform: os.platform(),
      platform_release: os.release()
    }
  })
}

let mainWindow
const winURL = process.env.NODE_ENV === "development"
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  log.info(`App (${version}) starting in ${process.env.NODE_ENV} mode`)

  mainWindow = new BrowserWindow({
    width: 1300,
    height: 1000
    // titleBarStyle: "hidden"
  })

  mainWindow.loadURL(winURL)

  ipcMain.on("APP_STARTED", (event) => {
    log.info("App has successfully started")
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if(process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if(mainWindow === null) {
    createWindow()
  }
})

// https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
//
// autoUpdater.on("update-downloaded", () => {
//   mainWindow.webContents.send("APP_NOTIFICATION", "A new update is available. Installing and restarting now..")
//   autoUpdater.quitAndInstall()
// })
//
// app.on("ready", () => {
//   if(process.env.NODE_ENV !== "development") {
//     autoUpdater.checkForUpdates()
//   }
// })
