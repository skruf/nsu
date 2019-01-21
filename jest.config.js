module.exports = {
  moduleFileExtensions: [ "js", "jsx", "json", "vue" ],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  snapshotSerializers: [ "jest-serializer-vue" ],
  "collectCoverage": false,
  "collectCoverageFrom": [
    "**/*.{js,vue}",
    "!**/node_modules/**"
  ],
  "coverageReporters": [
    "html",
    "text-summary"
  ],
  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(element-ui)/)"
  ]
}

// module.exports = {
//   "moduleFileExtensions": [
//     "js",
//     "json",
//     "vue"
//   ],
//   "moduleNameMapper": {
//     "^@/(.*)$": "<rootDir>/src/renderer/$1"
//   },
//   "transform": {
//     ".*\\.(vue)$": "vue-jest",
//     "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
//   },
//   "collectCoverage": false,
//   "collectCoverageFrom": [
//     "**/*.{js,vue}",
//     "!**/node_modules/**"
//   ],
//   "coverageReporters": [
//     "html",
//     "text-summary"
//   ],
//   "snapshotSerializers": [
//     "jest-serializer-vue"
//   ]
// }
