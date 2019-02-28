export default [
  {
    path: "/ranges",
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
