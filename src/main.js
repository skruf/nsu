const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron")
const { autoUpdater } = require("electron-updater")
const stateKeeper = require("electron-window-state")
const log = require("electron-log")
const path = require("path")
const url = require("url")
const fs = require("fs")

const IS_DEV = process.env.NODE_ENV === "development"
if(IS_DEV) require("electron-reload")(__dirname)

let win

const createWindow = async () => {
  const state = stateKeeper({
    defaultWidth: 1300,
    defaultHeight: 1000
  })

  win = new BrowserWindow({
    height: state.height,
    width: state.width,
    x: state.x,
    y: state.y,
    webPreferences: {
      nodeIntegration: false,
      preload: `${__dirname}/preload.js`
    }
  })

  state.manage(win)

  const startUrl = IS_DEV
    ? "http://localhost:1234"
    : url.format({
      pathname: path.join(__dirname, "../build/index.html"),
      protocol: "file:",
      slashes: true
    })

  win.loadURL(startUrl)

  const menuItems = [{
    label: "Stevnebehandler",
    submenu: [
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

  if(IS_DEV) {
    win.webContents.openDevTools()

    menuItems.push({
      label: "Developer",
      submenu: [
        { label: "Refresh", accelerator: "CmdOrCtrl+R", click() { win.webContents.reload() } },
        { label: "Back", accelerator: "CmdOrCtrl+Left", click() { win.webContents.goBack() } },
        { label: "Forward", accelerator: "CmdOrCtrl+Right", click() { win.webContents.goForward() } },
        { label: "Devtools", accelerator: "CmdOrCtrl+Alt+I", click() { win.webContents.openDevTools() } }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(menuItems)
  Menu.setApplicationMenu(menu)

  win.on("closed", () => {
    win = null
  })
}

app.on("ready", () => {
  const version = app.getVersion()
  log.info(`App (${version}) starting in ${process.env.NODE_ENV} mode`)

  createWindow()

  if(!IS_DEV) {
    require("./sentry")
    autoUpdater.checkForUpdates()
  }
})

app.on("window-all-closed", () => {
  if(process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if(win === null) createWindow()
})

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"

autoUpdater.on("checking-for-update", () => {
  win.webContents.send("SET_UPDATE_STATUS", {
    type: "UPDATE_CHECKING"
  })
})
autoUpdater.on("update-available", (event, info) => {
  win.webContents.send("SET_UPDATE_STATUS", {
    type: "UPDATE_AVAILABLE",
    message: info
  })
})
autoUpdater.on("update-not-available", (event, info) => {
  win.webContents.send("SET_UPDATE_STATUS", {
    type: "UPDATE_NOT_AVAILABLE",
    message: info
  })
})
autoUpdater.on("error", (event, error) => {
  log.error(error)
  win.webContents.send("SET_UPDATE_STATUS", {
    type: "UPDATE_ERROR",
    message: error
  })
})
// autoUpdater.on("download-progress", (progress) => {
//   try {
//     const percent = `${progress.percent.toFixed(0)}%`
//     const bytesPerSecond = `${formatBytes(progress.bytesPerSecond)}/s`
//     const total = formatBytes(progress.total)
//     const transferred = formatBytes(progress.transferred)
//     sendStatusToWindow(`Laster ned... ${percent} (${bytesPerSecond} - ${transferred}/${total})`)
//   } catch(e) {
//     log.error(e.message)
//   }
// })
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("SET_UPDATE_STATUS", {
    type: "UPDATE_DOWNLOADED"
  })

  const t = setTimeout(() => {
    autoUpdater.quitAndInstall()
    clearTimeout(t)
  }, 5000)
})
ipcMain.on("CHECK_FOR_UPDATES", (event) => {
  autoUpdater.checkForUpdates()
})

ipcMain.on("APP_STARTED", (event) => {
  log.info("App has successfully started")
})

ipcMain.on("PRINT_WINDOW", (event, fileName) => {
  const random = new Date().getUTCMilliseconds()
  win.webContents.printToPDF({
    landscape: true
  }, (error, data) => {
    if(error) throw error
    const documents = app.getPath("documents")
    const path = `${documents}/${fileName}_${random}.pdf`
    fs.writeFile(path, data, (error) => {
      if(error) throw error
      shell.openExternal(`file://${path}`, {
        activate: true
      })
    })
  })
})
