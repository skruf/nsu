import Vue from "vue"
import Router from "vue-router"
import events from "./events"
import clubs from "./clubs"
import ranges from "./ranges"
import classes from "./classes"

Vue.use(Router)

export default new Router({
  routes: [
    ...events,
    ...clubs,
    ...ranges,
    ...classes,
    {
      path: "/error",
      name: "ErrorScreen",
      component: require("./ErrorScreen").default,
      props: true
    },
    {
      path: "*",
      redirect: "/events"
    }
  ]
})
