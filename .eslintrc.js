const baseConfig = require('@instructure/ui-eslint-config')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'notice/notice': 'off',
  }
}