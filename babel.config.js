const loadConfig = require('@instructure/config-loader')

module.exports = function babel(api) {
  const isProduction = api.env('production')
  /*
  const presets = [
    '@babel/preset-typescript',
    [ '@babel/preset-env', {
      targets: {
        browsers: loadConfig(
          'browserslist',
          require('@instructure/browserslist-config-instui')
        )
      },
      useBuiltIns: 'entry',
      corejs: 3,
      modules: false,
      //debug: true, // un-comment if you want to see what browsers are being targeted and what plugins that means it will activate
      exclude: ['transform-typeof-symbol'],
      // have to include this plugin because babel-loader can't handle the `??` operator
      include: ['proposal-nullish-coalescing-operator']
    } ],
    [ '@babel/preset-react', { useBuiltIns: true } ]
  ]
  */
  const presets = [ require('@instructure/ui-babel-preset') ]
  const plugins = []
  /*
  plugins.push([
    require('@instructure/babel-plugin-transform-imports'),
    {
      '(@instructure/ui-[^(/|\\s)]+)$': {
        // eslint-disable-line no-useless-escape
        transform: (importName, matches) => {
          const ignore = [
            '@instructure/ui-test-queries',
            '@instructure/ui-test-sandbox',
            '@instructure/ui-test-utils'
          ]

          if (!matches || !matches[1] || ignore.includes(matches[1])) return
          return `${matches[1]}/lib/${importName}`
        }
      },
      // Convert any es imports to lib imports
      '(@instructure/ui-[^(/|\\s)]+/es/[^\\s]+)$': {
        // eslint-disable-line no-useless-escape
        transform: (importName, matches) => {
          if (!matches || !matches[1]) return
          return matches[1].replace(new RegExp('/es/'), '/lib/')
        }
      },
    }
  ])
  let babelHelperVersion = {}
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const version = require('@babel/helpers/package.json').version
    babelHelperVersion.version = version
  } catch (e) {
    // if something goes wrong, continue and don't try to explicitly set a helper version
  }
  plugins.push(
    require('babel-plugin-macros'),
    require('@babel/plugin-transform-destructuring').default,
    [require('@babel/plugin-proposal-decorators').default, { legacy: true }], // must run before plugins that set displayName!
    require('@instructure/ui-babel-preset/lib/babel-plugin-add-displayname-for-react.js'),
    [
      require('@babel/plugin-proposal-class-properties').default,
      { loose: true }
    ],
    require('@babel/plugin-proposal-export-default-from').default,
    [
      require('@babel/plugin-transform-runtime').default,
      {
        ...babelHelperVersion,
        corejs: false,
        regenerator: true,
        helpers: true,
        useESModules: false,
      }
    ],
    require('@babel/plugin-syntax-dynamic-import').default,
    require('babel-plugin-transform-undefined-to-void')
  )
  */

  if (!isProduction) {
    plugins.push('react-refresh/babel')
  }

  return { presets, plugins }
}
