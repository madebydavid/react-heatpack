#!/usr/bin/env node

var path = require('path')
var parseArgs = require('minimist')

var debug = require('../debug')
var pkg = require('../package.json')
var createWebpackConfig = require('../webpack.config')
var server = require('../server')

var merge = require('webpack-merge');

var args = parseArgs(process.argv.slice(2), {
  alias: {
    f: 'force',
    h: 'help',
    i: 'info',
    p: 'port',
    v: 'version',
    w: 'webpack',
    r: 'root'
  },
  boolean: ['force', 'help', 'info', 'version'],
  default: {
    port: 3000
  }
})

if (args.version) {
  console.log('v' + pkg.version)
  process.exit(0)
}
if (args.help || args._.length === 0) {
  console.log('Usage: heatpack [options] script.js')
  console.log('')
  console.log('Options:')
  console.log('  -f, --force   force heatpack to use the given script as the entry module')
  console.log('  -i  --info    show webpack module info')
  console.log('  -p, --port    port to run the webpack dev server on [default: 3000]')
  console.log('  -w, --webpack filename of a webpack.config which will be merged')
  console.log('  -r, --root    path of the root folder where index.html resides (optional)')
  console.log("  -v, --version print heatpack's version")
  process.exit(0)
}

var options = {
  entry: args.force ? path.resolve(args._[0]) : require.resolve('../entry'),
  noInfo: !args.info,
  port: args.port,
  script: path.resolve(args._[0]),
  root: path.resolve(args.root || path.join(__dirname, '../build/'))
}
debug('options', options)

var webpackConfig = createWebpackConfig(options);

if (args.webpack) {
  webpackConfig = merge(webpackConfig, require(path.resolve(process.cwd(), args.webpack)));
}

server(webpackConfig, options)
