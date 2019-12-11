const should = require('should');
const convertToV3 = require('../lib/convertToV3/convertToV3');
/* eslint-disable */
const testQueries = {
  v2: [
    [{"version": "0.2", "invoke": {"method": "count"}}, {"version": "0.2", "invoke": {"method": "count"}, "group_by": ["platform"]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "group_by": ["platform"]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "group_by": ["platform", "deploytype"]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$match": {"event": "ti.start"}}, "group_by": ["platform", "deploytype"]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$range": {"time": {"gte": 1522096142034, "lte": 1522096142036}}}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$range": {"time": {"gt": 1522096142034, "lte": 1522096142036}}}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$prefix": {"event": "ti.en"}}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$not": [{"$match": {"id": "127"}}]}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$or": [{"$match": {"id": "127"}}, {"$match": {"id": "129"}}]}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$and": [{"$match": {"id": "127"}}, {"$match": {"time": 1522096142037}}]}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$suffix": {"event": "end"}}}],
    [{"version": "0.2", "invoke": {"method": "distinct", "field": "event"}}],
    [{"version": "0.2", "invoke": {"method": "distinct", "field": "data.comp", "params": {"limit": 1}}}],
    [{"version": "0.2", "invoke": {"method": "cardinality", "field": "event"}}],
    [{"version": "0.2", "invoke": {"method": "find", "params": {"limit": 2, "include": ["id", "time", "event"]}}}],
    // [{"version": "0.2", "invoke": {"method": "find", "params": {"limit": 2, "offset": 1, "include": ["id", "time", "event"]}}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "filters": {"$exists": {"foobar": true}}}],
    [{"version": "0.2", "invoke": {"method": "count"}}],
    [{"version": "0.2", "invoke": {"method": "find", "params": {"limit": 2, "include": ["id", "time", "event"]}}, "group_by": ["event"]}],
    [{"version": "0.2", "invoke": {"method": "sum", "field": "temp"}}],
    [{"version": "0.2", "invoke": {"method": "avg", "field": "temp"}}],
    [{"version": "0.2", "invoke": {"method": "min", "field": "temp"}}],
    [{"version": "0.2", "invoke": {"method": "max", "field": "temp"}}],
    [{"version": "0.2", "invoke": {"method": "distinct", "field": "event", "params": {"count": false}}}],
    [{"version": "0.2", "invoke": {"method": "count"}, "group_by": ["data.comp"]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "group_by": ["data.comp", "data.level"]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "group_by": [{"type": "date", "field": "time", "params": {"interval": "day"}}]}],
    [{"version": "0.2", "invoke": {"method": "count"}, "group_by": [{"type": "numeric", "field": "temp", "params": {"interval": 3}}]}]
  ],
  v3:  [
    [{"version": "0.3", "operation": {"method": "count"}}, {"version": "0.3", "operation": {"method": "count"}, "groups": ["platform"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["platform"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["platform", "deploytype"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$match": {"event": "ti.start"}}, "groups": ["platform", "deploytype"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$range": {"time": {"gte": 1522096142034, "lte": 1522096142036}}}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$range": {"time": {"gt": 1522096142034, "lte": 1522096142036}}}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$prefix": {"event": "ti.en"}}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$not": [{"$match": {"id": "127"}}]}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$or": [{"$match": {"id": "127"}}, {"$match": {"id": "129"}}]}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$and": [{"$match": {"id": "127"}}, {"$match": {"time": 1522096142037}}]}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$suffix": {"event": "end"}}}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["event"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["data.comp"]}],
    [{"version": "0.3", "operation": {"method": "unique", "field": "event"}}],
    [{"version": "0.3", "operation": {"method": "find", "params": {"limit": 2, "include": ["id", "time", "event"]}}}],
    // [{"version": "0.3", "operation": {"method": "find", "params": {"limit": 2, "offset": 1, "include": ["id", "time", "event"]}}}],
    [{"version": "0.3", "operation": {"method": "count"}, "filters": {"$exists": {"foobar": true}}}],
    [{"version": "0.3", "operation": {"method": "count"}}],
    [{"version": "0.3", "operation": {"method": "find", "params": {"limit": 2, "include": ["id", "time", "event"]}}, "groups": ["event"]}],
    [{"version": "0.3", "operation": {"method": "sum", "field": "temp"}}],
    [{"version": "0.3", "operation": {"method": "avg", "field": "temp"}}],
    [{"version": "0.3", "operation": {"method": "min", "field": "temp"}}],
    [{"version": "0.3", "operation": {"method": "max", "field": "temp"}}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["event"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["data.comp"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": ["data.comp", "data.level"]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": [{"type": "date", "field": "time", "params": {"interval": "day"}}]}],
    [{"version": "0.3", "operation": {"method": "count"}, "groups": [{"type": "numeric", "field": "temp", "params": {"interval": 3}}]}]
  ]
};
/* eslint-enable */

suite('convertToV3', () => {
  test('test arrays are same length', (done) => {
    should(testQueries.v2.length).equal(testQueries.v3.length);
    done();
  });
  test('convert each query', (done) => {
    for (let i = 0; i < testQueries.v2.length; i += 1) {
      should(convertToV3(testQueries.v2[i])).deepEqual(testQueries.v3[i]);
    }
    done();
  });
});
