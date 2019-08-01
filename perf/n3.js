#!/usr/bin/env node
var N3 = require('n3');
var fs = require('fs'),
    path = require('path'),
    assert = require('assert');

if (process.argv.length !== 3)
  return console.error('Usage: n3.js filename');

var filename = path.resolve(process.cwd(), process.argv[2]),
    base = 'file://' + filename;

var TEST = '- Parsing file ' + filename;
console.time(TEST);

var count = 0;
new N3.Parser({ baseIRI: base }).parse(fs.createReadStream(filename), function (error, quad) {
  assert(!error, error);
  if (quad)
    count++;
  else {
    console.timeEnd(TEST);
    console.log('* Quads parsed: ' + count);
    console.log('* Memory usage: ' + Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB');
  }
});
