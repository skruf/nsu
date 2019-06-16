import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/events",
      name: "EventsListScreen",
      component: require("./EventsListScreen").default
    },
    {
      path: "/events/categories",
      name: "EventsCategoriesListScreen",
      component: require("./EventsCategoriesListScreen").default
    },
    {
      path: "/events/:eventId",
      name: "EventsViewScreen",
      component: require("./EventsViewScreen").default
    },
    {
      path: "/clubs",
      name: "ClubsListScreen",
      component: require("./ClubsListScreen").default
    },
    {
      path: "/clubs/:clubId",
      name: "ClubsViewScreen",
      component: require("./ClubsViewScreen").default
    },
    {
      path: "/ranges",
      name: "RangesListScreen",
      component: require("./RangesListScreen").default
    },
    {
      path: "/classes",
      name: "ClassesListScreen",
      component: require("./ClassesListScreen").default
    },
    {
      path: "/settings",
      name: "SettingsScreen",
      component: require("./SettingsScreen").default
    },
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
