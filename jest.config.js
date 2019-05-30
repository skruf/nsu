module.exports = {
  moduleFileExtensions: [ "js", "jsx", "json", "vue" ],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  moduleNameMapper: { "^~(.*)$": "<rootDir>/src/app/$1" },
  snapshotSerializers: [ "jest-serializer-vue" ],
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/app/**/*.{js,vue}",
    "!**/(node_modules|coverage|dist|build|plugins|utils/tests)/**",
    "!(tailwind.js|src/sentry.js|sentry-symbols.js|src/app/index.js)",
    "!**/*.config.*",
    "!**/(components|containers|screens)/**"
  ],
  coverageReporters: [ "text" ],
  testMatch: [
    "**/__tests__/*.spec.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(element-ui)/)"
  ],
  setupFiles: [
    "<rootDir>/src/app/utils/tests/setup.js"
  ]
}
