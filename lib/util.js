'use strict';

var fs = require('fs');
var path = require('path');

var suffix = ['.mp3'];

exports.tranverse = function(currentDirectory, root) {

  var filePath = [];

  var tranverse = function(currentDirectory, root) {

    var currentDir = fs.readdirSync(currentDirectory);

    for (var i in currentDir) {

      var currentFile = currentDir[i];
      var currentFilePath = path.resolve(currentDirectory, currentFile);
      var stats = fs.statSync(currentFilePath);

      if (stats.isDirectory()) {
        tranverse(currentFilePath, root);
        continue;
      }

      if (stats.isFile() && !!~suffix.indexOf(path.extname(currentFilePath))) {
        filePath.push({
          name: path.basename(currentFilePath),
          path: path.relative(root, currentFilePath)
        });
      }
    }
  };
  tranverse(currentDirectory, root);
  return filePath;
};
