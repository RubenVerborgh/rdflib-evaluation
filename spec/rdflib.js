const rdflib = require('rdflib');
const { Readable } = require('stream');
const DataFactory = require('@rdfjs/data-model');

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const NIL = DataFactory.namedNode(`${RDF}nil`);
const FIRST = DataFactory.namedNode(`${RDF}first`);
const REST = DataFactory.namedNode(`${RDF}rest`);

// Implements the IParser interface from rdf-test-suite
// https://github.com/rubensworks/rdf-test-suite.js/blob/master/lib/testcase/rdfsyntax/IParser.ts
module.exports = {
  async parse(data, baseIRI, { format }) {
    const quads = [];
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
        quads.push(DataFactory.quad(subject, predicate, object));
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
    rdflib.parse(data, store, baseIRI, format);
    return quads;
  },
};
