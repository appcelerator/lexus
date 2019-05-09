/**
 * Axway Lexus
 * Copyright (c) 2017-2019 by Axway, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const fs = require('fs');
const RECORDS_FILE = './testsuite/records/100.sensor.events.jsonl';
const queryFiles = [
  './testsuite/queries/query.sumMatchPrefixGroup.json',
  './testsuite/queries/query.maxGroup.json',
  './testsuite/queries/query.findMatchRange.json',
  './testsuite/queries/query.cardinalityOrMatch.json',
  './testsuite/queries/query.distinctNotMatch.json',
  './testsuite/queries/query.avgExists.json',
  './testsuite/queries/query.minSuffixGroup.json',
  './testsuite/queries/query.countAll100.json',
  './testsuite/queries/query.countAndMatch.json'
];

function jsonlToJson (jsonl) {
  let json = [];
  let lines = jsonl.split('\n');
  for (let line of lines) {
    if (line.length > 0) {
      json.push(JSON.parse(line));
    }
  }
  return json;
}

module.exports = {
  records: [],
  queries: {},
  init: function (callback) {
    let that = this;
    let waiting = queryFiles.length;
    function fileDone () {
      waiting -= 1;
      if (waiting <= 0) {
        fs.readFile(RECORDS_FILE, function (err, data) {
          if (err) {
            throw new Error(err);
          }
          that.records = jsonlToJson(data.toString());
          callback && callback();
        });
      }
    }
    for (let queryFile of queryFiles) {
      fs.readFile(queryFile, function (err, data) {
        if (err) {
          throw new Error(err);
        }
        let json = JSON.parse(data);
        that.queries[json.testId] = json;
        fileDone();
      });
    }
  }
};
