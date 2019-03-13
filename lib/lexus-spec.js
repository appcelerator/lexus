const fs = require('fs');
const path = require('path');

const ajv = new(require('ajv'))();
const rp = new(require('json-schema-ref-parser'))();

/*
  Exported functions.
 */

function bundle(vsn) {
  return locate(vsn).then(function (spec) {
    return new Promise(function (resolve, reject) {
      rp.bundle(spec, function (err, schema) {
        if (err) {
          return reject(err);
        }
        resolve(schema);
      });
    });
  });
}

function locate(vsn) {
  let parent = path.join(__dirname, '..', 'schema');
  let jSpecs = path.join(parent, 'schema.json');
  let ySpecs = path.join(parent, 'schema.yml');

  return new Promise(function (resolve, reject) {
    fs.access(jSpecs, function (err) {
      if (!err) {
        return resolve(jSpecs);
      }
      fs.access(ySpecs, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(ySpecs);
      });
    });
  });
}

function validate(vsn, query) {
  return bundle(vsn).then(function (schema) {
    return new Promise(function (resolve, reject) {
      if (!ajv.validate(schema, query)) {
        return reject(ajv.errors);
      }
      resolve(true);
    });
  });
}

/*
  Exported interface.
 */

exports.bundle = bundle;
exports.validate = validate;
