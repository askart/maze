const postcssPresetEnv = require("postcss-preset-env")

const config = () => ({
  plugins: [
    postcssPresetEnv({
      autoprefixer: {grid: true}
    })
  ]
})

module.exports = config
