"use strict"

import { app, BrowserWindow, ipcMain, Menu } from "electron"
import log from "electron-log"
// import { autoUpdater } from "electron-updater"

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")
}

let mainWindow
const winURL = process.env.NODE_ENV === "development"
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  const version = app.getVersion()
  log.info(`App (${version}) starting in ${process.env.NODE_ENV} mode`)

  const config = {
    width: 1300,
    height: 1000
    // titleBarStyle: "hidden"
  }

  if(
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    require("./sentry")
    // config.webPreferences = {
    //   nodeIntegration: false,
    //   preload: path.join(__dirname, "sentry.js")
    // }
  }

  mainWindow = new BrowserWindow(config)
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(winURL)

  const menuTemplate = [{
    label: "NSU Stevnebehandler",
    submenu: [
      // {
      //   label: "Om denne appen",
      //   click() {
      //     openAboutWindow({
      //       icon_path: path.join(config.rootDir, "/static/img/icon.png"),
      //       copyright: "Copyright (c) 2018 Bonum",
      //       package_json_dir: config.rootDir,
      //       open_devtools: config.dev
      //     })
      //   }
      // },
      // { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click() { app.quit() } }
    ]
  }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

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
