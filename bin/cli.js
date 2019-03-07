#! /usr/bin/env node

var printError = require('./util').printError;
var pixel2svg = require('pixel-art-2-svg');
var fileSystem = require('fs');
('use strict');

const [, , ...files] = process.argv;

if (files !== undefined && files.length > 0) {
  files.forEach(file => {
    pixel2svg(file).then(svgString => {
      const name = file.replace('.png', '');
      fileSystem.writeFile(`${name}.svg`, svgString, 'utf-8', () => console.log(`${name}.svg - done!`));
    });
  });
} else printError('Bad arguments : png2svg [...file.png]', true);
