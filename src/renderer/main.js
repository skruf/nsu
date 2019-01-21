import Vue from "vue"
import "ionicons/dist/css/ionicons.min.css"

import "./plugins/moment"
import "./plugins/element"
import "./design/index.styl"

import App from "./App"
import router from "./screens"
import store from "./store"

if(!process.env.IS_WEB) {
  Vue.use(require("vue-electron"))
}

Vue.config.devtools = true
Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app")
