module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2017,
    sourceType: "module"
    // parser: "babel-eslint"
  },
  env: {
    browser: true,
    node: true,
    "jest/globals": true
  },
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:vue/recommended"
  ],
  globals: {
    assert: true,
    expect: true,
    should: true,
    __static: true
  },
  plugins: [
    "vue",
    "jest"
  ],
  "rules": {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "warn",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "vue/name-property-casing": [ "warn", "PascalCase" ],
    "vue/component-name-in-template-casing": [ "warn", "kebab-case" ],
    "vue/no-unused-vars": 0,
    "vue/no-unused-components": "warn",
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "quotes": [ 0 ],
    "space-before-function-paren": 0,
    "keyword-spacing": 0,
    "no-console": 0,
    "padded-blocks": 0,
    "no-unused-vars": "warn",
    "no-trailing-spaces": "warn",
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/no-var-requires": 0
  }
}
