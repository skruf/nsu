module.exports = {
  moduleFileExtensions: [ "js", "jsx", "json", "vue" ],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/renderer/$1" },
  snapshotSerializers: [ "jest-serializer-vue" ],
  "collectCoverage": true,
  "collectCoverageFrom": [
    "**/*.{js,vue}",
    "!**/(node_modules|coverage|dist|plugins)/**",
    "!**/*.config.*",
    "!tailwind.js",
    "!src/main/index.dev.js"
  ],
  "coverageReporters": [
    "text"
    // "html",
    // "text-summary"
  ],
  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(element-ui)/)"
  ]
}
