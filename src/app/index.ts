import Vue from "vue"

import "./plugins/electron"
import "./plugins/moment"
import "./plugins/element"
import "./design/imports.css"
import "./design/index.styl"
import "./design/utils.css"

import i18n from "./i18n"
import App from "./App"
import router from "./screens"
import store from "./state"

Vue.config.devtools = true
Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  i18n,
  router,
  store,
  el: "#app",
  render: (h) => h(App)
})
