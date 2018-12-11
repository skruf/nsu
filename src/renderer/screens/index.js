import Vue from "vue"
import Router from "vue-router"
import events from "./events"
import clubs from "./clubs"

Vue.use(Router)

export default new Router({
  routes: [
    ...events,
    ...clubs,
    { path: "*", redirect: "/events" }
  ]
})
