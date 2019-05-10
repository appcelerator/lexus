/**
 * Axway Lexus
 * Copyright (c) 2017-2019 by Axway, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const fs = require('fs').promises;
const path = require('path');

const RECORDS_FILE = '100.sensor.events.jsonl';

module.exports.records = [];
module.exports.queries = {};

module.exports.init = async function () {
  let queries = path.join(__dirname, 'queries');
  let records = path.join(__dirname, 'records');

  let children = await fs.readdir(queries);

  for (let child of children) {
    let src = path.join(queries, child);
    let test = await fs.readFile(src, 'utf8');
    let parsed = JSON.parse(test);

    this.queries[parsed.testId] = parsed;
  }

  let file = path.join(records, RECORDS_FILE);
  let jsonl = await fs.readFile(file, 'utf8');

  this.records = jsonl
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => JSON.parse(line));
};
