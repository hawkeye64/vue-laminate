const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const rollup = require('rollup')
const uglify = require('uglify-js')
const buble = require('@rollup/plugin-buble')
const json = require('@rollup/plugin-json')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')

const buildConf = require('./config')
const buildUtils = require('./utils')

const rollupPlugins = [
  nodeResolve({
    extensions: ['.js'],
    preferBuiltins: false
  }),
  json()
  // buble({
  //   objectAssign: 'Object.assign'
  // })
]

const builds = [
  {
    rollup: {
      input: {
        input: resolve(`../src/index.js`)
      },
      output: {
        file: resolve(`../dist/index.esm.js`),
        format: 'es'
      }
    },
    build: {
      // unminified: true,
      minified: true
    }
  },
  {
    rollup: {
      input: {
        input: resolve(`../src/index.js`)
      },
      output: {
        file: resolve(`../dist/index.common.js`),
        format: 'cjs',
        exports: 'auto'
      }
    },
    build: {
      // unminified: true,
      minified: true
    }
  }
]

build(builds)

/**
 * Helpers
 */

function resolve (_path) {
  return path.resolve(__dirname, _path)
}

function build (builds) {
  return Promise
    .all(builds.map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig (opts) {
  Object.assign(opts.rollup.input, {
    plugins: rollupPlugins,
    external: [ 'vue' ]
  })

  Object.assign(opts.rollup.output, {
    banner: buildConf.banner,
    globals: { vue: 'Vue' }
  })

  return opts
}

function addExtension (filename, ext = 'min') {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`
}

function buildEntry (config) {
  return rollup
    .rollup(config.rollup.input)
    .then(bundle => bundle.generate(config.rollup.output))
    .then(({ output }) => {
      const code = config.rollup.output.format === 'umd'
        ? injectVueRequirement(output[0].code)
        : output[0].code

      return config.build.unminified
        ? buildUtils.writeFile(config.rollup.output.file, code)
        : code
    })
    .then(code => {
      if (!config.build.minified) {
        return code
      }

      const minified = uglify.minify(code, {
        compress: {
          pure_funcs: ['makeMap']
        }
      })

      if (minified.error) {
        return Promise.reject(minified.error)
      }

      return buildUtils.writeFile(
        config.build.minExt === true
          ? addExtension(config.rollup.output.file)
          : config.rollup.output.file,
        buildConf.banner + minified.code,
        true
      )
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

function injectVueRequirement (code) {
  const index = code.indexOf(`Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue`)

  if (index === -1) {
    return code
  }

  const checkMe = ` if (Vue === void 0) {
    console.error('[ Vue-Laminate ] Vue is required to run. Please add a script tag for it before loading Vue-Laminate.')
    return
  }
  `

  return code.substring(0, index - 1) +
    checkMe +
    code.substring(index)
}
