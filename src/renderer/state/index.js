import Vue from "vue"
import Vuex from "vuex"
import stores from "./stores"

Vue.config.devtools = true
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: stores
})

export default store
