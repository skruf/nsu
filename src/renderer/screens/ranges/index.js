export default [
  {
    path: "/ranges",
    name: "RangesScreen",
    component: require("./RangesScreen").default,
    children: [
      {
        path: "",
        name: "RangesListScreen",
        component: require("./RangesListScreen").default
      },
      {
        path: ":rangeId",
        name: "RangesViewScreen",
        component: require("./RangesViewScreen").default
      }
    ]
  }
]
