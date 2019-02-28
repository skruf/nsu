export default [
  {
    path: "/clubs",
    component: require("./ClubsScreen").default,
    children: [
      {
        path: "",
        name: "ClubsListScreen",
        component: require("./ClubsListScreen").default
      },
      {
        path: ":clubId",
        name: "ClubsViewScreen",
        component: require("./ClubsViewScreen").default
      }
    ]
  }
]
