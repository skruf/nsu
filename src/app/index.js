import Vue from "vue"

import "./plugins/electron"
import "./plugins/rx"
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

import AppMigrater from "./AppMigrater"

// if(process.env.NODE_ENV === "development") {
//   Vue.config.devtools = true
// }

Vue.config.silent = true
Vue.config.devtools = false
Vue.config.productionTip = false

;(async () => {
  // const migrations = await init()
  // if(migrations) {
  //   new Vue({ // eslint-disable-line no-new
  //     i18n,
  //     el: "#app",
  //     render: (h) => h(AppMigrater, {
  //       props: { collections: migrations }
  //     })
  //   })
  // } else {
  //   new Vue({ // eslint-disable-line no-new
  //     i18n,
  //     router,
  //     store,
  //     el: "#app",
  //     render: (h) => h(App)
  //   })
  // }

  await init()
  new Vue({ // eslint-disable-line no-new
    i18n,
    router,
    store,
    el: "#app",
    render: (h) => h(App)
  })
})()
