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

  app.use(express.static(options.root))

  app.get('*', function(req, res) {
    var indexFile = path.join(options.root, 'index.html');
    res.sendFile(indexFile);
  })

  app.listen(options.port, '0.0.0.0', function(err) {
    if (err) {
      console.error(err.stack)
      process.exit(1)
    }
    console.log('react-heatpack listening at http://0.0.0.0:' + options.port)
  })
}
