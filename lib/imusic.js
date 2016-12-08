'use strict';

var fs = require('fs');
var koa = require('koa');
var path = require('path');
var _ = require('koa-route');
var serve = require('koa-static');
var child_process = require('child_process');

var tranverse = require('./util').tranverse;

module.exports = function(port) {

  var app = koa();
  var root = process.cwd();
  var file = path.join(__dirname, '..', 'index.html');
  var assets_dir = path.join(__dirname, '..');

  app.use(_.get('/', function *() {
    var content = fs.readFileSync(file, 'utf8');
    this.body = content;
  }));

  app.use(serve(assets_dir));
  app.use(serve(root));

  app.use(_.get('/api/get_musics', function *() {

    var data = tranverse(root, root);

    this.body = {
      success: true,
      data: data
    }
  }));

  app.listen(port, function() {
    var server_url = `http://localhost:${port}`;
    console.log(`server start: ${server_url}`);
    child_process.exec(`open ${server_url}`);
  });

};

