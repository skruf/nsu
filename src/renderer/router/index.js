import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "events",
      component: require("@/screens/events").default
    },
    {
      path: "/events/view",
      name: "eventsView",
      component: require("@/screens/events/view").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
})
