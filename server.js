var path = require('path')
var express = require('express')
var webpack = require('webpack')
var fs = require('fs')

module.exports = function server(config, options) {
  var app = express()
  var compiler = webpack(config)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: options.noInfo,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 300
    }
  }))

  app.use(require('webpack-hot-middleware')(compiler))

  app.use(express.static(path.join(__dirname, '../../build')))

  app.get('*', function(req, res) {
    var parentIndexFile = path.join(__dirname, '../../build/index.html');
    var indexFile = path.join(__dirname, 'build/index.html');
    try {
      fs.accessSync(parentIndexFile, fs.F_OK);
      res.sendFile(parentIndexFile);
    } catch (e) {
      res.sendFile(indexFile);
    }
  })

  app.listen(options.port, '0.0.0.0', function(err) {
    if (err) {
      console.error(err.stack)
      process.exit(1)
    }
    console.log('react-heatpack listening at http://0.0.0.0:' + options.port)
  })
}
