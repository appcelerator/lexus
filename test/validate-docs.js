const fs = require('fs').promises;
const spec = require('../lib/spec');

function getLexusQueries(s) {
  let queries = [];
  let results = {
    query: null,
    index: 0
  };
  while (results.index !== -1) {
    results = getNextLexusQuery(s, results.index);
    if (results.index !== -1) {
      try {
        queries.push(JSON.parse(results.query));
      } catch (e) {
        // not a query
      }
    }
  }
  return queries;
}

function getNextLexusQuery(s, index) {
  const TRIPLE_BACKTICK = '```';
  let idx = s.indexOf(TRIPLE_BACKTICK, index);
  if (idx !== -1) {
    let edx = s.indexOf(TRIPLE_BACKTICK, idx + 1);
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

function isLexusQuery(j) {
  try {
    if (!Array.isArray(j)) {
      j = [ j ];
      for (let q of j) {
        if (q.version) {
          return true;
        }
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

suite('Lexus Over Streams', function () {
  test('docs/getting-started.md', async function () {
    let data = await fs.readFile('./docs/getting-started.md');
    let queries = getLexusQueries(data.toString());

    for (let query of queries) {
      if (isLexusQuery(query)) {
        try {
          await spec.validate(Object.assign(query, {
            version: 'dev'
          }));
        } catch (e) {
          throw new Error(e.message + '\n\n' + JSON.stringify(query, null, 2));
        }
      }
    }
  });
});
