import Vue from "vue"

import "./plugins/moment"
import "./plugins/element"
import "./design/imports.css"
import "./design/index.styl"
import "./design/utils.css"

import { init } from "./db"
import i18n from "./i18n"
import App from "./App"
import router from "./screens"
import store from "./state"

Vue.config.silent = true
Vue.config.devtools = false
Vue.config.productionTip = false

;(async () => {
  await init()
  new Vue({ // eslint-disable-line no-new
    i18n,
    router,
    store,
    el: "#app",
    render: (h) => h(App)
  })
})()
