const os = require("os")
const Sentry = require("@sentry/electron")
const electron = require("electron")

const version = electron.app.getVersion()

Sentry.init({
  dsn: "https://8f6797916b144212bbf53d3e927dab0e@sentry.io/1411934",
  enableNative: false,
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
