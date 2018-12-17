export default [
  {
    path: "/classes",
    name: "ClassesScreen",
    component: require("./ClassesScreen").default,
    children: [
      {
        path: "",
        name: "ClassesListScreen",
        component: require("./ClassesListScreen").default
      },
      {
        path: ":classId",
        name: "ClassesViewScreen",
        component: require("./ClassesViewScreen").default
      }
    ]
  }
]
