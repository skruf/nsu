export default [
  {
    path: "/events",
    component: require("./EventsScreen").default,
    children: [
      {
        path: "",
        name: "EventsListScreen",
        component: require("./EventsListScreen").default
      },
      {
        path: "create",
        name: "EventsCreateScreen",
        component: require("./EventsCreateScreen").default
      },
      {
        path: ":eventId",
        name: "EventsViewScreen",
        component: require("./EventsViewScreen").default
      }
    ]
  }
]
