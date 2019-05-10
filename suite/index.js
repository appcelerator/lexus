/**
 * Axway Lexus
 * Copyright (c) 2017-2019 by Axway, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const fs = require('fs').promises;
const path = require('path');

const RECORDS_FILE = '100.sensor.events.jsonl';
const QUERY_FILES = [
  'query.sumMatchPrefixGroup.json',
  'query.sumMatchPrefixGroup.json',
  'query.maxGroup.json',
  'query.findMatchRange.json',
  'query.cardinalityOrMatch.json',
  'query.distinctNotMatch.json',
  'query.avgExists.json',
  'query.minSuffixGroup.json',
  'query.countAll100.json',
  'query.countAndMatch.json'
];

module.exports.records = [];
module.exports.queries = {};

module.exports.init = async function () {
  for (let query of QUERY_FILES) {
    let loaded = await _readQueryFile(query);
    this.queries[loaded.testId] = loaded;
  }
  this.records = await _readRecordFile(RECORDS_FILE);
};

async function _readQueryFile(file) {
  return JSON.parse(await _readResourceFile('queries', file));
}

async function _readRecordFile(file) {
  let jsonl = await _readResourceFile('records', file);

  return jsonl
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => JSON.parse(line));
}

async function _readResourceFile(type, file) {
  let src = path.join(__dirname, type, file);
  return await fs.readFile(src, 'utf8');
}
