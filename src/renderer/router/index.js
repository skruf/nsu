import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/events",
      name: "ListEventsScreen",
      component: require("@/screens/events/ListEventsScreen").default
    },
    {
      path: "/events/:eventId",
      name: "ViewEventScreen",
      component: require("@/screens/events/ViewEventScreen").default
    },
    {
      path: "*",
      redirect: "/events"
    }
  ]
})
