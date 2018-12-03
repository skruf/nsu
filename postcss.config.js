const tailwindcss = require("tailwindcss")

module.exports = ({ file, options, env }) => ({
  plugins: [
    tailwindcss("./tailwind.js")
  ]
})
