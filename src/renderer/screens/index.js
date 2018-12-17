import Vue from "vue"
import Router from "vue-router"
import events from "./events"
import clubs from "./clubs"
import classes from "./classes"

Vue.use(Router)

export default new Router({
  routes: [
    ...events,
    ...clubs,
    ...classes,
    { path: "*", redirect: "/events" }
  ]
})
