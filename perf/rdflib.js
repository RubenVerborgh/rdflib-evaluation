#!/usr/bin/env node
var rdflib = require('rdflib');
var DataFactory = require('@rdfjs/data-model');
var fs = require('fs'),
    path = require('path'),
    assert = require('assert');

if (process.argv.length !== 3)
  return console.error('Usage: rdflib.js filename');

var filename = path.resolve(process.cwd(), process.argv[2]),
    base = 'file://' + filename;

var TEST = '- Parsing file ' + filename;
console.time(TEST);

var count = 0;
const contents = fs.readFileSync(filename, 'utf8');

const store = {
  sym(uri) {
    return Object.assign(DataFactory.namedNode(uri), { uri });
  },

  literal(value, language, datatype) {
    return DataFactory.literal(value, language || datatype);
  },

  bnode(label) {
    return DataFactory.blankNode(label);
  },

  add(subject, predicate, object, document) {
    DataFactory.quad(subject, predicate, object);
    count++;
  },

  list(elements) {
    const list = elements.length === 0 ? NIL : store.bnode();
    let head = list;
    for (var i = 0; i < elements.length; i++) {
      const next = i === elements.length - 1 ? NIL : store.bnode();
      store.add(head, FIRST, elements[i]);
      store.add(head, REST, next);
      head = next;
    }
    return list;
  },

  setPrefixForURI(qn, uri) {
  },
};
rdflib.parse(contents, store, base);

console.timeEnd(TEST);
console.log('* Quads parsed: ' + count);
console.log('* Memory usage: ' + Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB');
