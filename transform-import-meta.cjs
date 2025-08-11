/* eslint-disable @typescript-eslint/no-require-imports */
const vue3Jest = require('@vue/vue3-jest')

module.exports = {
  process(sourceText, sourcePath, options) {
    const transformedCode = sourceText.replace(
      /import\.meta\.env\.(\w+)/g,
      "process.env.$1 || 'http://localhost:3000/api/v1'"
    )

    return vue3Jest.process(transformedCode, sourcePath, options)
  }
}
