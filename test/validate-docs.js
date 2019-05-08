const fs = require('fs');
const should = require('should');
const lexusSpec = require('../lib/lexus-spec');
const LEXUS_VERSION = '0.2';

function validateLexusQuery(query) {
  lexusSpec.validate(LEXUS_VERSION, query);
}

function getLexusQueries(s) {
  let queries = [];
  let results = {
    query: null,
    index: 0
  };
  while (results.index !== -1) {
    results = getNextLexusQuery(s, results.index);
    if (results.index !== -1) {
      queries.push(results.query);
    }
  }
  return queries;
}

function getNextLexusQuery(s, index) {
  const TRIPPLE_BACKTICK = '```';
  let idx = s.indexOf(TRIPPLE_BACKTICK, index);
  if (idx !== -1) {
    let edx = s.indexOf(TRIPPLE_BACKTICK, idx + 1);
    if (edx !== -1) {
      return {
        query: s.substring(idx + 3, edx),
        index: edx + 3
      };
    }
  }
  let result = {
    query: null,
    index: -1
  };
  return result;
}

function isLexusQuery(s) {
  try {
    let j = JSON.parse(s);
    if (!Array.isArray(j)) {
      j = [ j ];
      for (let q of j) {
        if (q.version === LEXUS_VERSION) {
          return true; // just return true of first of the queries looks like a Lexus query
        }
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

suite('Lexus Over Streams', () => {
  test('docs/getting-started.md', (done) => {
    fs.readFile('./docs/getting-started.md', function (err, data) {
      if (err) {
        return done(err);
      }
      let queries = getLexusQueries(data.toString());
      for (let query of queries) {
        if (isLexusQuery(query)) {
          validateLexusQuery(query);
          should({ foo: 'FIX' }).deepEqual({ bar: 'ME' });
        }
      }
      done();
    });
  });
});
