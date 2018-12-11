export default [
  {
    path: "/events",
    name: "EventsScreen",
    component: require("./EventsScreen").default,
    children: [
      {
        path: "",
        name: "EventsListScreen",
        component: require("./EventsListScreen").default
      },
      {
        path: ":eventId",
        name: "EventsViewScreen",
        component: require("./EventsViewScreen").default
      }
    ]
  }
]
